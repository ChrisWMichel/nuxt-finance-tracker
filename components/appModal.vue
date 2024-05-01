<template>
  <div>
    <div>
    <!-- <UButton /> -->

    <UModal v-model="isOpen">
      <div class="p-4 flex items-center justify-center text-2xl">
        <!-- <Placeholder class="h-48" /> -->
        <slot/>
      </div>
    </UModal>
  </div>
  </div>
</template>

<script lang="ts" setup>
const isOpen = ref(true)
</script>

<style>

</style>