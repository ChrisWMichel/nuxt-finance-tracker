<template>
  <div>
    <AppModal v-if="showModal" >{{ modalMessage }}</AppModal>
    <div class="mb-4">
      <UFormGroup label="Current avatar" class="w-full" help="This would be blank by default">
        <UAvatar src="https://avatars.githubusercontent.com/u/11839301?v=4" size="3xl" />
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

// We need to get the actual avatar URL

const uploading = ref(false)
const fileInput = ref() // Reference to an input with ref="fileInput" attribute

const saveAvatar = async () => {
  // 1. Get the uploaded file
  //    a) If no file uploaded, show toast error
  // 2. Generate the new filename
  const file = fileInput.value.input.files[0]
  if (!file) {
    showModal.value = true
    modalMessage.value = 'No file uploaded'
    return
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.value.id}.${fileExt}`
  console.log('File name:', fileName)
  try {
    uploading.value = true
    // 1. Grab the current avatar URL
    // 2. Upload the image to avatars bucket
    // 3. Update the user metadata with the avatar URL
    // 4. (OPTIONALLY) remove the old avatar file
    // 5. Reset the file input

  
   showModal.value = true
   setTimeout(() => {
    showModal.value = false
    }, 2000)
  } catch (error) {
    showModal.value = true
    modalMessage.value = error.message
  } finally {
    uploading.value = false
    modalMessage.value = 'Avatar updated successfully'
      
  }
}
</script>