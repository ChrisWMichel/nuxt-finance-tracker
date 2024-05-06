<template>
  <div>
    <AppModal v-if="showModal" >{{ modalMessage }}</AppModal>
    <div class="mb-4">
      <UFormGroup label="Current avatar" class="w-full" help="This would be blank by default">
        <UAvatar :src="avatarUrl" size="3xl" />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup label="New avatar" class="w-full" name="avatar"
        help="After choosing an image click Save to actually upload the new avatar">
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>

    <UButton type="submit" color="black" variant="solid" label="Save" :loading="uploading" :disabled="uploading"
      @click="saveAvatar" />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const showModal = ref(false)
const modalMessage = ref('')

const avatarUrl = useAvatarUrl()

const uploading = ref(false)
const fileInput = ref() 

const saveAvatar = async () => {
  const file = fileInput.value.input.files[0]
  if (!file) {
    showModal.value = true
    modalMessage.value = 'No file uploaded'
    return
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  try {
    uploading.value = true

    const currentAvatar = user.value.user_metadata?.avatar_url
    if (currentAvatar) {
      const {error} = await supabase.storage.from('avatars').remove([currentAvatar])
      if (error) throw error
    }
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)

    if (error) throw error

    await supabase.auth.updateUser({
        data: {
          avatar_url: fileName,
        },
      })
    await supabase.auth.update({
      user_metadata: {
        avatar_url: fileName,
      },
    })

    

    fileInput.value.input.value = null

  } catch (error) {
    showModal.value = true
    modalMessage.value = error.message
  } finally {
    showModal.value = true
    uploading.value = false
    modalMessage.value = 'Avatar updated successfully'
    setTimeout(() => {
    showModal.value = false
    }, 2000)
  }
}
</script>