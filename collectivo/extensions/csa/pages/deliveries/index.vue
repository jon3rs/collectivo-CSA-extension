<script setup lang="ts">
const date = ref(new Date());
const startdate = ref("2024-02-14");
const startDate = ref(new Date(startdate.value));
const weeklyToggle = ref(false);
const deliveriesAmount = ref(2);
//const deliveries = ref([]);

function convertToDate(date: string) {
  return new Date(date);
}

async function createDeliveries() {
  if (!weeklyToggle.value) {
    await createCSADelivery(convertToDate(startdate.value)).then((res) => {
      console.log("created new delivery: ", res);
    });

    return;
  } else {
    for (let i = 0; i < deliveriesAmount.value; i++) {
      await createCSADelivery(
        new Date(
          convertToDate(startdate.value).setDate(
            convertToDate(startdate.value).getDate() + i * 7
          )
        )
      ).then((res) => {
        console.log("created new delivery: ", res);
      });
    }

    return;
  }
}

const deliveries = computed(() => {
  const deliveries: Date[] = [];

  for (let i = 0; i < deliveriesAmount.value; i++) {
    deliveries.push(
      new Date(
        convertToDate(startdate.value).setDate(
          convertToDate(startdate.value).getDate() + i * 7
        )
      )
    );
  }

  console.log("deliveries: ", deliveries);
  return deliveries;
});
</script>

<template>
  <div>
    <h1>Deliveries</h1>
    <p>{{ date }}</p>
    <h2>neue Lieferung(en) anlegen:</h2>
    <div>
      <div>
        <label for="startdate">Lieferdatum:</label>
        <input
          type="text"
          name="startdate"
          id="startdate"
          placeholder="2024-02-14"
          v-model="startdate"
        />
        <label for="weeklyToggle"> wöchentliche Lieferung erstellen</label>
        <input
          type="checkbox"
          name="weeklyToggle"
          id="weeklyToggle"
          v-model="weeklyToggle"
        />
        <label for="deliveriesAmount">Anzahl an Lieferungen:</label>
        <input
          type="text"
          name="deliveriesAmount"
          id="deliveriesAmount"
          placeholder="5"
          :disabled="!weeklyToggle"
          v-model="deliveriesAmount"
        />
        <UButton @click="createDeliveries()" :disabled="!startdate">
          Lieferung erstellen
        </UButton>
      </div>
      <div v-if="weeklyToggle">
        <p>folgenden Lieferungen werden bei Klick auf den Button angelegt:</p>
        <ul class="text-xs text-gray-500">
          <li v-for="(delivery, index) in deliveries" :key="index">
            <p>{{ delivery }}</p>
          </li>
        </ul>
      </div>
    </div>

    <!--     <CollectivoFormDatePicker v-model="date"></CollectivoFormDatePicker>
 -->
  </div>
</template>
