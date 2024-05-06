<template>
  <header class="flex items-center justify-between">
    <NuxtLink to="/" class="mt-5 ml-5 text-2xl font-bold">Finance Tracker</NuxtLink>
  
  <div class="mt-5 mr-5">
    <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }" v-if="user">
      <UAvatar :src="avatarUrl" alt="Avatar" />

      <template #account="{ item }">
        <div class="text-left">
          <p>
            Signed in as
          </p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ user.email }}
          </p>
        </div>
      </template>

      <template #item="{ item }">
        <span class="truncate">{{ item.label }}</span>

        <UIcon :name="item.icon" class="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500 ms-auto" />
      </template>
    </UDropdown>
  </div>
</header>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const avatarUrl = useAvatarUrl()
const items = [
  [{
    label: user.value?.email,
    slot: 'account',
    disabled: true
  }], [{
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth',
    click: () => navigateTo('/settings/profile')
  }, {
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: async () => {
      await supabase.auth.signOut()
      return navigateTo('/login')
    }
  }]
]
</script>

<style>

</style>