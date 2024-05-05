<template>
  <div>
    <AppModal v-if="showModal" >{{ modalMessage }}</AppModal>

    <UForm :state="state" :schema="schema" @submit="saveProfile">
     
      <UFormGroup label="Full Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="Email" name="email" help="If you change your email, you will receive a confirmation email." class="mb-4">
        <UInput v-model="state.email"/>
      </UFormGroup>
      <UButton :loading="pending" variant="solid" type="submit" >Save</UButton>
    </UForm>
    
  </div>
</template>

<script lang="ts" setup>
import {z} from 'zod'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const showModal = ref(false)
const modalMessage = ref('')
const pending = ref(false)

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email()
})

const state = ref({
  name: user.value?.user_metadata.full_name,
  email: user.value?.email
});

const saveProfile = async () => {
  const data: { data: { full_name: string, email?: string } } = {
  data: {
    full_name: state.value.name,
  }
}
  pending.value = true
  try{
   
    if(state.value.email !== user.value?.email){
      data.data.email = state.value.email
    }
    const { error } = await supabase.auth.updateUser(data)
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
    console.error(error)
  }
  finally{
    pending.value = false
    modalMessage.value = 'Profile updated successfully'
      
  }
  

}

</script>

<style>

</style>