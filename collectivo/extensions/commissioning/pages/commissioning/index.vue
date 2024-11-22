<!-- This section will be available under /example -->

<script setup lang="ts">
setCollectivoTitle("Commissioning");
const crop = ref<string>("");
const amount = ref<number>(0);
const ratioTable = ref<HTMLElement | null>(null);
const iOMatrix = ref<Array<Array<boolean>> | null>(null)
const depotXRatioExceptions = ref<Array<depotXRatioException> | null>(null);


interface Share {
  size: string;
  amount: number;
}
interface depotXShares {
  depot: string;
  shares: Share[];
}
interface depotXRatioException {
  depot: string;
  ratioIndices: Array<number>;
}

const depotXSharesDummy = ref<Array<depotXShares>>([
  {
    depot: "Mülheim",
    shares: [
      { size: "klein", amount: 12 },
      { size: "groß", amount: 5 },
    ],
  },
  {
    depot: "Nippes",
    shares: [
      { size: "klein", amount: 22 },
      { size: "groß", amount: 15 },
    ],
  },
  {
    depot: "Chicago",
    shares: [
      { size: "klein", amount: 17 },
      { size: "groß", amount: 13 },
    ],
  },
  {
    depot: "Downtown",
    shares: [
      { size: "klein", amount: 23 },
      { size: "groß", amount: 15 },
    ],
  },
  {
    depot: "Uptown",
    shares: [
      { size: "klein", amount: 32 },
      { size: "groß", amount: 19 },
    ],
  },
  {
    depot: "Hauzenberg",
    shares: [
      { size: "klein", amount: 14 },
      { size: "groß", amount: 10 },
    ],
  },
]);

const ratios = ref<Array<Array<number>>>([
  [1, 0],
  [0, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [1, 1],
]);

function getTotalShareSizes(shareSize: string) {
  let total = 0;

  depotXSharesDummy.value.forEach((depotXShares) => {
    depotXShares.shares.forEach((share) => {
      if (share.size === shareSize) {
        total += share.amount;
      }
    });
  });

  return total;
}

function getResultingSharesAmount(ratioIndex: number) {
  let total = 0;

  depotXSharesDummy.value.forEach((depot, depotIndex) =>{
    if(iOMatrix.value && iOMatrix.value[depotIndex][ratioIndex]){
      total += depot.shares.reduce((sum, share, shareIndex) => sum + share.amount * ratios.value[ratioIndex][shareIndex], 0);
    }
  })

  return total;
}

function printRatios(){
  const printContent = ratioTable.value;

  if(printContent){
    const printWindow = window.open("", "", "width=1000,height=800");
    
    if (printWindow){
      printWindow.document.write('<html><head><title>Print Ratio</title></head><body>');
      // Copy styles from the main document
      
      const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join("");
          } catch (e) {
            console.error(e);
            return "";
          }
        })
        .join("");

      printWindow.document.write(`<style>${styles}</style>`);
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.print();
    }
    /* const printContentInner = printContent.innerHTML;
  const originalContent = document.body.innerHTML;
  if(printContentInner) document.body.innerHTML = printContentInner;
  window.print();
  document.body.innerHTML = originalContent;
  console.log(printContent) */
  } 
}

function getDifferenceClass(difference: number){
  if(difference === 0){
    return "text-green-500";
  }else if(difference < 0){
    return "text-red-500";
  }else{
    return "text-black";
  }
}

function excludeDepotXRatio(depot: string, ratioIndex: number){
  
  if(depotXRatioExceptions.value){
    const matchingDepot = depotXRatioExceptions.value.findIndex((exception) => exception.depot === depot);
    
    if(matchingDepot !== -1){

      if(!depotXRatioExceptions.value[matchingDepot].ratioIndices.some(index => index == ratioIndex)){
        depotXRatioExceptions.value[matchingDepot].ratioIndices.push(ratioIndex);
      }
    }else{
      depotXRatioExceptions.value.push({depot: depot, ratioIndices: [ratioIndex]});
    }  
  }else{
    depotXRatioExceptions.value = [{depot: depot, ratioIndices: [ratioIndex]}];
  }

  console.log("updated depotXRatioExceptions", depotXRatioExceptions.value);
}

watch(iOMatrix, (newMatrix, oldMatrix) => {
  console.log("iOMatrix changed", newMatrix, oldMatrix);
})


onMounted(() => {
    iOMatrix.value = Array.from({ length: depotXSharesDummy.value.length }, () => Array(ratios.value.length).fill(true));

    console.log("mounted", iOMatrix.value);
  });
</script>

<template>
  <div>
    <p>howdy commissioner!</p>
    <p>which crop do you want to commission?</p>
    <UInput v-model="crop" placeholder="crop name" />
    <p>Amount:</p>
    <UInput v-model="amount"  type="number" placeholder="amount in pieces" />

    <div>
      <div class="card bg-primary-50 p-3 mt-4"  ref="ratioTable">
        <div class="w-full mb-4">
          <UButton 
            icon="i-heroicons-printer"
            @click="printRatios"
            class="float-right"
            >
            Schlüsseltabelle drucken
          </UButton>
        </div>
        <table class="w-full ">
          <tr class="my-3">
            <th rowspan="2">
              <span class="">KW XX</span>
            </th>
            <th :colspan="ratios.length">
              <div>
                {{ depotXSharesDummy[0].shares[0].size }}:{{ depotXSharesDummy[0].shares[1].size }}
              </div>
              <div class="ml-auto mr-[50%] border-r border-slate-800 h-2"></div>
              <div class="mx-1 h-2 border-x border-t border-slate-800"></div>
            </th>
          </tr>
          <tr >
            <th v-for="(ratio, index) in ratios" :key="index" class="">
              <span v-for="(number, i) in ratio" :key="i">
                <span>{{ number }}</span>
                <span v-if="i+1 != ratio.length">:</span>
              </span>
            </th>
          </tr>

          <tr v-for="(depotXShares, depotIndex) in depotXSharesDummy" :key="depotXShares.depot"  class="">
            <!-- further table rows -->
            <th class="text-left">{{ depotXShares.depot }}</th>
            <td v-for="(ratio, ratioIndex) in ratios" :key="ratioIndex">
              <div class="share-x-depot">
                <span :class="(iOMatrix && !iOMatrix[depotIndex][ratioIndex]) ? 'italic text-slate-400': ''" class="mt-1">{{ ratio[0] * depotXShares.shares[0].amount + ratio[1] * depotXShares.shares[1].amount }}</span>
                <UCheckbox v-if="iOMatrix" v-model="iOMatrix[depotIndex][ratioIndex]"  type="checkbox"  :checked="iOMatrix[depotIndex][ratioIndex]" class="print:hidden"></UCheckbox>
              </div>
            </td>
          </tr>

          <tr class="border-t border-slate-800">
            <th class="text-left pt-2">Gesamt: </th>
            <td v-for="(ratio, index) in ratios" :key="index" class="px-auto pt-2">
              {{ getResultingSharesAmount(index) }}
            </td>
          </tr>

          <tr class="print:hidden">
            <th class="text-left">Differenz:</th>
            <td v-for="(ratio, index) in ratios" :key="index" class="px-auto">
              <span :class="getDifferenceClass(amount - getResultingSharesAmount(index))">
                {{ amount - getResultingSharesAmount(index) }}
              </span>
            </td>
           </tr>
          
        </table>
        
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media print{
  table, th, tr, td{
    @apply border-2 border-collapse border-black bg-white;
}
}

.share-x-depot{
  @apply px-3 py-1 m-1 rounded-lg bg-slate-300 align-middle flex justify-between;
}
</style>