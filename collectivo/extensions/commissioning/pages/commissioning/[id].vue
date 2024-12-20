<script setup lang="ts">
interface AmountPerGroup {
  memberGroup: number;
  amount: number;
}

const route = useRoute();
console.log(route.params.id);
const commissioningId = route.params.id;
const harvest = ref(await getHarvestOfCommissioning(route.params.id));
const crops = ref(await getCrops());
const units = ref(await getUnits());
const shareSizeGroups = ref(await getShareSizeGroups());
const activeHarvestItem = ref<number | null>(null);
const amountsPerMembergroup = ref<AmountPerGroup[][]>([[]]);
//const packingLists = ref<PackingList[]>([]); // one more dimension to add for depots
const packingLists = ref<Map<number, PackingList>>(new Map());

const packingListToggled = ref<boolean[]>([]);
const initialPackingNotes = ref<string>(await getPackingNotes(route.params.id));
const packingNotes = ref<string>(initialPackingNotes.value);

const distributedPartialHarvestItems = ref<distributedPartialHarvestItem[]>(
  await getPartialDistributedHarvestItemsOfCommissioning(route.params.id)
);

const distributionMatrix = ref<Partial<distributedPartialHarvestItem>[][][]>(
  []
);

const memberGroups = ref(
  await getMemberGroupsForCommissioning(route.params.id)
);

/* const getPackingLists */

const getPackingList = async (shareSizeGroup: shareSizeGroup) => {
  const shareSizes = await getShareSizesOfGroup(shareSizeGroup.id);
  const harvestItems = harvest.value.com_harvest_item;
  let packingList = [];

  // Initialize packing list with empty values
  for (let column = 0; column < shareSizes.length + 2; column++) {
    packingList[column] = new Array(harvestItems.length + 2);
  }

  shareSizes.forEach((shareSize, index) => {
    packingList[index + 1][0] = shareSize.name_of_share_size;

    //also filter for depot here in the future
    const memberGroupsOfShareSize = memberGroups.value.filter(
      (group: comMemberGroup) => group.share_size == shareSize.id
    );

    if (memberGroupsOfShareSize.length > 1) {
      console.error("More than one member group for share size", shareSize);
      return;
    } else if (memberGroupsOfShareSize.length == 0) {
      console.error("No member group for share size", shareSize);
      return;
    }

    const partiallyDistributedHarvestItemsOfGroup =
      distributedPartialHarvestItems.value.filter(
        (item) => item.member_group == memberGroupsOfShareSize[0].id
      );

    harvestItems.forEach((harvestItem, harvestItemIndex) => {
      const distributedItem = partiallyDistributedHarvestItemsOfGroup.find(
        (item) => item.harvest_item == harvestItem.id
      );

      packingList[index + 1][harvestItemIndex + 1] =
        distributedItem?.amount_per_member || null;
    });

    packingList[index + 1][packingList[0].length - 1] =
      memberGroupsOfShareSize[0].amount;
  });

  packingList[0][packingList[0].length - 1] = "gesamt: ";

  // fill in harvest items name and unit
  harvestItems.forEach((harvestItem, index) => {
    packingList[0][index + 1] = crops.value.find(
      (crop) => crop.id == harvestItem.harvested_crop
    )?.name_of_crop;

    packingList[packingList.length - 1][index + 1] = units.value.find(
      (unit) => unit.id == harvestItem.items_unit
    )?.name_of_unit;
  });

  //console.log("shareSizes", shareSizes);
  //console.log("harvestItems", harvestItems);
  console.log("packingList", packingList);

  return {
    nameOfPackingList: "Packliste für " + harvest.value.name_of_harvest,
    packingList: packingList,
  };
};

const populateDistributionMatrix = () => {
  distributionMatrix.value = shareSizeGroups.value.map((group) => {
    // First dimension: share size groups
    return group.com_share_sizes.map((shareSize) => {
      // Second dimension: share sizes
      const memberGroup = memberGroups.value.find(
        (group: comMemberGroup) => group.share_size === shareSize.id
      );

      //check for distributedPartialHarvestItem where harvest_item = activeHarvestItem and member_group = memberGroup
      const alreadyDistributedItem = distributedPartialHarvestItems.value.find(
        (item) =>
          item.harvest_item == activeHarvestItem.value &&
          item.member_group == memberGroup.id
      );

      if (alreadyDistributedItem) {
        return [alreadyDistributedItem];
      }

      // Third dimension: array for each harvest item
      return [
        {
          amount_per_member: 0,
          members_amount: memberGroup?.amount || 0,
          member_group: memberGroup?.id || null,
          of_commissioning: parseInt(
            Array.isArray(commissioningId)
              ? commissioningId[0]
              : commissioningId
          ),
          harvest_item: activeHarvestItem.value,
        },
      ];
    });
  });

  console.log("distributionMatrix: ", distributionMatrix);
};

const loadShareSizes = async () => {
  try {
    for (const group of shareSizeGroups.value) {
      group.com_share_sizes = await getShareSizesOfGroup(group.id);
    }
  } catch (error) {
    console.error("Error loading share sizes:", error);
  }
};

const loadHarvestItems = async () => {
  try {
    const harvestItemIds = [...harvest.value.com_harvest_item];
    const promises = harvestItemIds.map((id) => getHarvestItem(id));
    harvest.value.com_harvest_item = await Promise.all(promises);
    console.log("Loaded harvest items:", harvest.value.com_harvest_item);
  } catch (error) {
    console.error("Error loading harvest items:", error);
  }
  //harvest has an array of ids harvest.value.com_harvest_item. Iterate over it, fetch the harvestItems with await getHarvestItem and push them into harvestItems
};

const loadDistributedPartialHarvestItems = async () => {
  /* try {

  } catch (error) {
    console.error("Error loading distributed partial harvest items:", error);
  } */
};

async function populatePackingLists() {
  for (const group of shareSizeGroups.value) {
    const list = await getPackingList(group);
    packingLists.value.set(group.id, list);
  }
}

function setPackingListVisibility() {
  shareSizeGroups.value.forEach((group) => {
    packingListToggled.value.push(false);
  });
}

onMounted(async () => {
  //console.log("amountsPerMembergroup ", amountsPerMembergroup);
  console.log("memberGroups: ", memberGroups);
  await loadShareSizes();
  await loadHarvestItems();
  await loadDistributedPartialHarvestItems();
  populateDistributionMatrix();
  populatePackingLists();
  setPackingListVisibility();

  console.log("packingLists", packingLists);
});

function setActiveHarvestItem(id: number) {
  activeHarvestItem.value = id;
}

function getRemainingAmount(shareSizeGroupIndex = 0) {
  if (!activeHarvestItem.value)
    return "Wähle zuerst einen zu verteilenden Posten aus.";

  const minuend = harvest.value.com_harvest_item.find(
    (item: HarvestItem) => item.id == activeHarvestItem.value
  )?.harvested_amount;

  let subtrahend = 0;

  shareSizeGroups.value[shareSizeGroupIndex].com_share_sizes.forEach(
    (shareSize, index) => {
      const amount = memberGroups.value.find(
        (group: comMemberGroup) => group.share_size == shareSize.id
      )?.amount;

      if (
        amount &&
        distributionMatrix.value[shareSizeGroupIndex][index][0] &&
        distributionMatrix.value[shareSizeGroupIndex][index][0]
          .amount_per_member
      )
        subtrahend +=
          amount *
          distributionMatrix.value[shareSizeGroupIndex][index][0]
            .amount_per_member;
    }
  );

  const difference = minuend - subtrahend;

  return { minuend: minuend, subtrahend: subtrahend, difference: difference }; // minuend + " - " + subtrahend + " = " + (minuend - subtrahend);
}

async function saveDistribution() {
  if (initialPackingNotes.value !== packingNotes.value) {
    console.log("saving packing notes");
    await savePackingNotes(commissioningId, packingNotes.value);
  }

  if (!activeHarvestItem.value) {
    console.error("No active harvest item selected.");
    alert("Wähle zuerst einen zu verteilenden Posten aus.");
    return;
  }

  try {
    for (const shareSizeGroup of distributionMatrix.value) {
      for (const shareSize of shareSizeGroup) {
        for (const distributedPartialHarvestItem of shareSize) {
          if (
            distributedPartialHarvestItem.amount_per_member &&
            distributedPartialHarvestItem.amount_per_member > 0 &&
            activeHarvestItem.value
          ) {
            distributedPartialHarvestItem.harvest_item =
              activeHarvestItem.value;

            if (distributedPartialHarvestItem.id) {
              await updatePartialDistributedHarvestItem(
                distributedPartialHarvestItem
              ).then((response) => {
                console.log("response", response);
                //populateDistributionMatrix();
              });
            } else {
              await createPartialDistributedHarvestItem(
                distributedPartialHarvestItem
              ).then((response) => {
                console.log("response", response);
                //populateDistributionMatrix();
              });
            }

            console.log(
              "distributedPartialHarvestItem",
              distributedPartialHarvestItem
            );
          }
        }
      }
    }

    updatePartialDistributedHarvestItems();
    populateDistributionMatrix();
  } catch (error) {
    console.error("Error saving distribution:", error);
  }
}

watch(amountsPerMembergroup, (value) => {
  console.log("amountsPerMembergroup changed", value);
});

watch(activeHarvestItem, (value) => {
  console.log("activeHarvestItem changed", value);
  populateDistributionMatrix();
});

watch(distributedPartialHarvestItems, () => {
  populatePackingLists();
});

async function updatePartialDistributedHarvestItems() {
  distributedPartialHarvestItems.value =
    await getPartialDistributedHarvestItemsOfCommissioning(route.params.id);
}
</script>

<template>
  <div>
    <div>Commissioning for Harvest: {{ harvest.name_of_harvest }}</div>
    <div class="-mx-2">
      <UButton
        class="mx-1"
        :color="harvestItem.id == activeHarvestItem ? 'primary' : 'gray'"
        v-for="harvestItem in harvest.com_harvest_item"
        :key="harvestItem.id"
        @click="setActiveHarvestItem(harvestItem.id)"
      >
        <span>{{ harvestItem.harvested_amount }}</span>
        <span>
          {{
            units.find((unit) => unit.id == harvestItem.items_unit)
              ?.name_of_unit
          }}
        </span>
        <span>
          {{
            crops.find((crop) => crop.id == harvestItem.harvested_crop)
              ?.name_of_crop
          }}
        </span>
      </UButton>
    </div>
    <div
      v-for="(shareSizeGroup, shareSizeGroupIndex) in shareSizeGroups"
      :key="shareSizeGroup.id"
    >
      <div>{{ shareSizeGroup.group_name }}</div>

      <div class="grid grid-flow-col justify-stretch -mx-2 mt-1">
        <div
          v-for="(shareSize, shareSizeIndex) in shareSizeGroups[
            shareSizeGroupIndex
          ].com_share_sizes"
          :key="shareSize.id"
        >
          <div class="p-2 mx-1 bg-slate-200 rounded">
            <div class="flex justify-between">
              <span class="p-1">Größe:</span>
              <span class="p-1">{{ shareSize.name_of_share_size }}</span>
            </div>
            <div class="flex justify-between">
              <span class="p-1">Faktor:</span>
              <span class="p-1">{{ shareSize.factor }}</span>
            </div>
          </div>
          <div class="p-2 mx-1 mt-1 bg-slate-200 rounded">
            <div class="flex justify-between">
              <span class="p-1">Menge:</span>
              <span class="p-1">{{
                memberGroups.find(
                  (group: comMemberGroup) => group.share_size == shareSize.id
                )?.amount
                  ? memberGroups.find(
                      (group: comMemberGroup) =>
                        group.share_size == shareSize.id
                    )?.amount
                  : "/"
              }}</span>
              <!-- <span>!</span> make conditional, only show when amount in distributed partial differs-->
            </div>
            <div>
              <span> Menge pro Anteil: </span>
              <UInput
                v-if="
                  distributionMatrix[shareSizeGroupIndex] &&
                  distributionMatrix[shareSizeGroupIndex][shareSizeIndex] &&
                  distributionMatrix[shareSizeGroupIndex][shareSizeIndex][0]
                "
                v-model="
                  distributionMatrix[shareSizeGroupIndex][shareSizeIndex][0]
                    .amount_per_member
                "
                type="number"
                min="0"
                step="0.1"
              ></UInput>
            </div>
            <div
              v-if="
                distributionMatrix[shareSizeGroupIndex] &&
                distributionMatrix[shareSizeGroupIndex][shareSizeIndex]
              "
            >
              <span
                v-if="
                  memberGroups &&
                  distributionMatrix[shareSizeGroupIndex][shareSizeIndex][0] &&
                  distributionMatrix[shareSizeGroupIndex][shareSizeIndex][0]
                    .amount_per_member
                "
                >ergibt:
                {{
                  distributionMatrix[shareSizeGroupIndex][shareSizeIndex][0]
                    .amount_per_member *
                  distributionMatrix[shareSizeGroupIndex][shareSizeIndex][0]
                    ?.members_amount
                }}
                Einheiten</span
              >
            </div>
          </div>
          <!-- <div>{{ shareSize.name_of_size }}</div>
        <div>{{ shareSize.size }}</div>
        <div>{{ shareSize.price }}</div> -->
        </div>
      </div>
      <div class="flex justify-between mt-2 align-middle">
        <div class="flex">
          <span>Rest: </span>
          <span
            v-if="typeof getRemainingAmount(shareSizeGroupIndex) == 'string'"
            >{{ getRemainingAmount(shareSizeGroupIndex) }}</span
          >
          <div v-else>
            {{ getRemainingAmount(shareSizeGroupIndex).minuend }} -
            {{ getRemainingAmount(shareSizeGroupIndex).subtrahend }} =
            <span
              :class="
                getRemainingAmount(shareSizeGroupIndex).difference < 0
                  ? 'text-red-500'
                  : ''
              "
            >
              {{ getRemainingAmount(shareSizeGroupIndex).difference }}
            </span>
          </div>
        </div>
        <div>
          <UButton @click="saveDistribution()">Verteilung speichern</UButton>
        </div>
      </div>
      <div class="my-4">
        <p class="my-2">Notizen für die Packer:innen:</p>
        <UTextarea class="my-2" v-model="packingNotes"></UTextarea>
      </div>
      <div class="card bg-green-50 my-5 p-5">
        <div
          class="flex justify-between"
          @click="
            packingListToggled[shareSizeGroupIndex] =
              !packingListToggled[shareSizeGroupIndex]
          "
        >
          <div class="flex items-center">
            <UIcon name="i-heroicons-queue-list" />
            <span class="ml-2">Packliste(n)</span>
          </div>
          <div>
            <UIcon
              :name="
                packingListToggled[shareSizeGroupIndex]
                  ? 'i-heroicons-chevron-up-solid'
                  : 'i-heroicons-chevron-down-solid'
              "
            />
          </div>
        </div>
        <div v-if="packingListToggled[shareSizeGroupIndex]">
          <PackingListPrinter
            :packing-list="packingLists.get(shareSizeGroup.id)"
            :notes="packingNotes"
          ></PackingListPrinter>
        </div>
      </div>
    </div>
  </div>
</template>
