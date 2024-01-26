<script setup lang="ts">
import { ref, reactive } from "vue";

const newNames = ref([]);
const testArray = ref(["test1", "test2", "test3", "test4"]);

let csaMemberships = await getCSAMemberships().then((res) => {
  console.log(res);

  res.forEach((membership) => {
    newNames.value.push(membership.csa_membership_name);
  });

  return res;
});

const membershipName = ref("");
console.log(csaMemberships);

async function addMembership() {
  console.log("membershipName:", membershipName.value);

  await addNewMembership(membershipName.value).then(() => {
    refreshForm();
  });
}

async function updateName(id: string | number, newName: string) {
  console.log("newNames:", newName);
  await updateMembershipName(id, newName);
}

async function refreshForm() {
  membershipName.value = "";
  csaMemberships = await reactive(getCSAMemberships());
  console.log(csaMemberships);
}

async function deleteMembership(id: string | number) {
  console.log(id);
  await deleteCSAMembership(id);
  refreshForm();
}

await getFieldsByCollection("csa_membership").then((res) => {
  console.log(res);
});

await getCollection("csa_membership").then((res) => {
  console.log(res);
});
</script>

<template>
  <div>
    <h1>CSA</h1>
    <div v-for="item in testArray" :key="item">
      {{ item }}
    </div>
    <ul class="memberships mt-5">
      <li
        v-for="(membership, index) in csaMemberships"
        :key="membership.id"
        class="mt-4 px-2 py-1"
      >
        <span class="mr-2">your memberships name:</span>
        <span
          v-if="
            membership.csa_membership_name == null ||
            membership.csa_membership_name == ''
          "
          class="mr-2"
          >" "</span
        >
        <span v-else class="mr-2">{{ membership.csa_membership_name }}</span>
        <input
          v-model="newNames[index]"
          name="updateName"
          type="text"
          class="mr-2 text-sm p-2 py-1 text-gray-600"
        />
        <button @click="updateName(membership.id, newNames[index])">
          update name
        </button>
        <button @click="deleteMembership(membership.id)">
          delete Membership
        </button>
      </li>
    </ul>
    <div class="mt-8">
      <label for="membershipName">New Membership name: </label>
      <input v-model="membershipName" type="text" name="membershipName" />
      <br />
      <button type="submit" @click="addMembership()">
        create new Membership
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
input {
  border: solid 1px black;
}
.memberships {
  li:nth-child(2n) {
    background: gray;
  }
}
</style>
