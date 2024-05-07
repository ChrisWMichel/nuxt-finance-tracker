<template>
  <div>
    <AppModal v-if="showModal" class="text-red-700">{{ modalMessage }}</AppModal>
    <UCard v-if="!success">
      <template #header>
        <h1 class="text-2xl font-bold">Sign-in to Finance Tracker</h1>
      </template>

      <form @submit.prevent="handleLogin">
        <UFormGroup class="mb-4" :required="true" help="You will receive and email with a confirmation link.">
          <UInput type="email" placeholder="Enter your email" required v-model="email" autocomplete="email" />
        </UFormGroup>

        <div class="flex items-center justify-center">
          <UButton type="submit" variant="solid" color="black" :loading="pending" :disabled="pending">
          Sign in
        </UButton>
        </div>
      </form>
    </UCard>
    <UCard v-else>
      <template #header>
        <h1 class="text-2xl font-bold">Welcome to Finance Tracker</h1>
      </template>
      <div class="text-center">
        <p class="mb-4">
          We have sent an email to <strong>{{ email }}</strong> with a link to sign in.
        </p>
        <p>
          <strong>Important:</strong> The link will expire in 5 minutes.
        </p>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const success = ref(false)
const email = ref('')
const pending = ref(false)
const modalMessage = ref('')
const showModal = ref(false)
const supabase = useSupabaseClient()
const redirectUrl = useRuntimeConfig().public.baseUrl

useRedirectIfAuthenticated()

const handleLogin = async () => {
  pending.value = true
  try {
    const { error } = await supabase.auth.signInWithOtp({
       email: email.value,
       options:{
          emailRedirectTo: `${redirectUrl}/confirm`
       } 
      })
    if (error) {
      modalMessage.value = error.message
      showModal.value = true
    } else{
      success.value = true
    }
    success.value = true
  } catch (error) {
    throw error
  } finally {
    pending.value = false
  }
}

</script>

<style>

</style>