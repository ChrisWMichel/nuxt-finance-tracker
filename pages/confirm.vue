<template>
  <div>
    <UCard>
      <template #header>
        Signing in...
      </template>
      Wait a moment while we sign you in...
    </UCard>
  </div>
</template>

<script lang="ts" setup>

useRedirectIfAuthenticated()
</script>

<style>

</style>