<script setup lang="ts">
const shareTypes: Ref<csaShareType[]> = ref(await getCSAShareTypes())

</script>

<template>
    <div>
        <div v-for="shareType in shareTypes" :key="shareType.id"> 
            <CSACommissioningListPerShareType :share-type="shareType" />
        </div>
    </div>
</template>