<template>
  <div class="grid grid-cols-6 gap-8">
    <UVerticalNavigation :links="links" class="col-span-2" />
    <div class="col-span-4">
     <NuxtPage/>
    </div>
  </div>
</template>

<script lang="ts" setup>
const val = ref(0)
const links = [
  {
    label: 'Profile',
    icon: 'i-heroicons-user-circle',
    to: '/settings/profile'
  },
  {
    label: 'Avatar',
    icon: 'i-heroicons-face-smile-solid',
    to: '/settings/avatar'
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth',
    to: '/settings/settings'
  }
  
]
</script>

<style>

</style>