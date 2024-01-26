<script setup lang="ts">
const memberships = ref([]);

const refreshMemberships = async () => {
  memberships.value = await getCSAMembershipsOfCurrentUser();
};
onMounted(() => {
  refreshMemberships();
});
//await getCSAMembershipsOfCurrentUser();

async function requestMembership() {
  const user = await getCurrentUser();
  await addNewMembership(user).then((res) => {
    console.log("new membership: ", res);
    refreshMemberships();
  });
}

async function requestShare(memberId: number, size: number, depot: number) {
  await addShare(memberId, size, depot).then(() => {
    refreshMemberships();
  });
}
async function addShare(id: number, shareSizeId: number, depotId: number) {
  console.log("id: ", id);
  console.log("shareSizeId: ", shareSizeId);
  console.log("depotId: ", depotId);
  await addCSAShareToMembership(id, shareSizeId, depotId).then((res) => {
    console.log("new share: ", res);
  });
}

const shareSizes = await getCSAShareSizes();
const shareTypes = await getCSAShareTypes();
const checkedSize = ref("");
const csaDepots = await getCSADepots();
const checkedDepot = ref("");
</script>

<template>
  <div>
    <h1>My Shares:</h1>
    <div
      v-if="memberships.length == 0"
      class="my-5 rounded-xl bg-white shadow-sidebar px-3 py-5 flex justify-between"
    >
      <p>
        You are not a member of any CSA. You first need to be member of a CSA in
        order to receive a share
      </p>
      <UButton @click="requestMembership()">request membership</UButton>
    </div>
    <div v-else>
      <div v-for="membership in memberships" :key="membership">
        <CSAMembership
          @refreshMemberships="refreshMemberships"
          :csaMembership="membership"
        />
        <div v-if="membership.csa_share_of_membership.length == 0">
          <p>you don't have any shares yet</p>
          <p class="font-bold">available Sharetypes:</p>
          <div v-for="shareType in shareTypes" :key="shareType" class="">
            <p class="font-bold">Anteilsart:</p>
            <span>{{ shareType.csa_share_type_name }}</span>
            <div class="my-3">
              <p>verfügbare Größen:</p>
              <ul>
                <li v-for="size in shareSizes" :key="size">
                  <input
                    type="radio"
                    name="{{ size.id }}"
                    :value="size.id"
                    v-model="checkedSize"
                    id=""
                  />
                  <label for="{{ size.id }}">{{
                    size.csa_share_size_name
                  }}</label>
                </li>
              </ul>
            </div>
            <div class="my-3">
              <p>Default Depot:</p>
              <ul>
                <li v-for="depot in csaDepots" :key="depot">
                  <input
                    type="radio"
                    :value="depot.id"
                    name="{{ depot.id }}"
                    v-model="checkedDepot"
                  />
                  <label for="{{ depot.id }}">
                    {{ depot.csa_depot_name }}</label
                  >
                </li>
              </ul>
            </div>
          </div>

          <UButton
            @click="requestShare(membership.id, checkedSize, checkedDepot)"
          >
            create share
          </UButton>
        </div>
        <div class="flex" v-else>
          <div v-for="share in membership.csa_share_of_membership" :key="share">
            <CSAShareOfMembership
              @refreshDepot="refreshMemberships"
              :csaShare="share"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
