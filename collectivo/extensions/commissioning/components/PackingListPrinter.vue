<script setup lang="ts">
const printableArea = ref<HTMLElement | null>(null);

const props = defineProps({
  packingList: {
    type: Object as PropType<PackingList>,
    required: false,
  },
});

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
  <div v-if="packingList" ref="printableArea">
    <UButton @click="printTables()">printTables</UButton>
    <h3>{{ packingList?.nameOfPackingList }}</h3>
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
      <tbody></tbody>
    </table>
  </div>
</template>

<style lang="scss">
@media print {
  table {
    page-break-after: always;
  }
}
table {
  @apply w-full;
}
@media print {
  table,
  th,
  tr,
  td {
    @apply border-2 border-collapse border-black;
  }
  tr {
    @apply even:bg-gray-100;
  }
}
</style>
