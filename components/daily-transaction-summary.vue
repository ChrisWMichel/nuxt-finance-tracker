<template>
  <div class="grid grid-cols-2 justify-items-center py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold">
    <div class="flex items-center justify-between w-[100%]">
      {{ date }}
    </div>

    <div class="flex items-center justify-end w-full mr-20">
      {{ currency }}
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: string;
}
const props = defineProps({
  date: {
    type: String,
    required: true
  },
  transactions: {
    type: Array as () => Transaction[],
    required: true
  }
})

const sum = computed(() => {
  let sum = 0;
  let tran: Transaction;
  for( tran of props.transactions) {
    if(tran.type === 'income') {
      sum += tran.amount
    } else {
      sum -= tran.amount
    }
  }
  return sum
})

const currency = useCurrency(ref(sum))


</script>

<style>

</style>