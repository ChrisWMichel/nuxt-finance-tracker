<template>
  <AppModal v-if="showModal">{{ modalMessage }}</AppModal>
  <UForm :state="state" :schema="schema" @submit="saveSettings">
    <UFormGroup label="Transaction View" class="mb-4" help="Choose how you would like to view transactions">
      <USelect v-model="state.transactionView" :options="transactionViewOptions"/>
    </UFormGroup>

    <UButton type="submit" color="black" variant="solid" label="Save" :loading="pending" :disabled="pending" />
  </UForm>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import { transactionViewOptions } from '~/constants';

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const pending = ref(false)
const showModal = ref(false)
const modalMessage = ref('')
const state = ref({
  transactionView: user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1]
})
const schema = z.object({
  transactionView: z.enum([...transactionViewOptions] as [string, ...string[]])
})

const saveSettings = async () => {
  pending.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: state.value.transactionView
      }
    
    })
    if (error) {
    showModal.value = true
    modalMessage.value = error.message
    return
   }
   showModal.value = true
   setTimeout(() => {
      showModal.value = false
      }, 2000)
  } catch (error) {
    if (error instanceof Error) {
    showModal.value = true
    modalMessage.value = error.message
  }
  } finally {
    pending.value = false
    modalMessage.value = 'Setting updated successfully'
  }
}
</script>