<template>
  <AppModal v-if="showModal">{{ modalMessage }}</AppModal>
  <div class="grid grid-cols-2 justify-items-center py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
    <div class="flex items-center justify-between w-[100%]">
      <div class="flex items-center space-x-2">
        <UIcon :name="icon" class="w-6 h-6 " :class="['text-' + iconColor + '-600']" />
        <div>{{ tran.description }}</div>
      </div>
      <div>
        <UBadge color="white" v-if="tran.category" >{{ tran.category }}</UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-4 w-full">
      <div>{{currency}}</div>
      <div>
        <UDropdown :items="items" :popper="{placement: 'bottom-start'}">
          <UButton trailing-icon="i-heroicons-ellipsis-horizontal" variant="ghost" :loading="isLoading" ></UButton>
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient()
// type TransactionProps = {
//   id: string,
//   amount: number,
//   description: string,
//   category: string,
//   timestamp: string,
//   type: string
// }

const emit = defineEmits(['deleted'])

const props = defineProps({
  tran: {
    type: Object, //as PropType<TransactionProps>,
    required: true
  }
})
const showModal = ref(false)
const modalMessage = ref('this is a modal')
const isLoading = ref(false)

const currency = useCurrency(ref(props.tran.amount))

const isIncome = computed(() => props.tran.type === 'income')
const icon = computed(() => {
  return isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
})
const iconColor = computed(() => {
  return isIncome.value  ? 'green' : 'red'
})

const deleteTransaction = async () => {
  isLoading.value = true

  try{
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', props.tran.id)
    if (error) {
      throw error
    }
    modalMessage.value = 'Transaction deleted successfully'
    showModal.value = true
  } catch (error) {
    modalMessage.value = 'Failed to delete transaction'
    showModal.value = true
  } finally {
    isLoading.value = false      
    setTimeout(() => {
      showModal.value = false
      emit('deleted')
    }, 2000)
  }
}

const items = [[
{
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => console.log('Edit transaction with id:')
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction
    }
]]


</script>

<style>

</style>