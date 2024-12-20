<script setup lang="ts">
const props = defineProps({
  packingList: {
    type: Object as PropType<PackingList>,
    required: false,
  },
  notes: {
    type: String,
    required: false,
    default: "",
  },
});

const printableArea = ref<HTMLElement | null>(null);

onMounted(() => {
  console.log("thepackinglist", props.packingList);
});

function printTables() {
  const printContent = printableArea.value;

  if (printContent) {
    const printWindow = window.open("", "", "width=1000,height=800");

    if (printWindow) {
      printWindow.document.write(
        "<html><head><title>Print Ratio</title></head><body>"
      );
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
      printWindow.document.write("</body></html>");
      printWindow.print();
    }
  }
}
</script>

<template>
  <div v-if="packingList" ref="printableArea" class="packing-list">
    <h3 class="mt-5 align-middle">{{ packingList?.nameOfPackingList }}</h3>

    <table>
      <thead>
        <tr>
          <th
            v-for="(headerItem, index) in packingList.packingList"
            :key="index"
          >
            {{ headerItem[0] }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="even:bg-gray-100"
          v-for="rowIndex in packingList.packingList[0].length - 2"
          :key="rowIndex"
        >
          <td
            v-for="columnIndex in packingList.packingList.length"
            :key="columnIndex"
          >
            {{
              packingList.packingList[columnIndex - 1][rowIndex]
                ? packingList.packingList[columnIndex - 1][rowIndex]
                : "-"
            }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th v-for="footerItem in packingList.packingList">
            {{ footerItem[footerItem.length - 1] }}
          </th>
        </tr>
      </tfoot>
    </table>
    <div>
      <p class="my-5">Notizen für die Packer:innen :)</p>
      <p>{{ notes }}</p>
    </div>
    <div class="flex justify-end mt-5 print:hidden">
      <UButton icon="i-heroicons-printer" @click="printTables()"
        >printTables</UButton
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media print {
  .packing-list {
    page-break-after: always;
  }
}
table {
  @apply w-full;
}
table,
th,
tr,
td {
  @apply border-2 border-collapse border-black text-center;
}
tr {
  @apply even:bg-gray-100;
}
@media print {
  table,
  th,
  tr,
  td {
    @apply border-2 border-collapse border-black text-center;
  }
  tr {
    @apply even:bg-gray-100;
  }
}
</style>
