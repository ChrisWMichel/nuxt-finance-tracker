<template>
  <section class="flex justify-between items-center mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelect v-model="selectedView" :options="transactionViewOptions"/>
    </div>
  </section>

  <section class="grid grid-cols-2 gap-10 md:grid-cols-4 sm:gap-16 mb-10 justify-items-center">
    <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="3000" :loading="isLoading"/>
    <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="5000" :loading="isLoading"/>
    <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="isLoading"/>
    <Trend color="red" title="Savings" :amount="4000" :last-amount="4500" :loading="isLoading"/>
  </section>

  <section class="flex justify-between mb-10">
    <div class="flex justify-between items-center mb-10">
      <h3 class="text-lg font-extrabold pr-2">Transactions:</h3>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} income and {{ expenseCount }} expense transactions this period.
      </div>
    </div>
    <div>
       <UButton icon="i-heroicons-plus-circle" variant="solid" >Add</UButton>
    </div>
  </section>

  <section v-if="!isLoading">
    <div v-for="(transactionOnDay, date) in transactionsGroupByDate" :key="date" class="mb-10">
      <DailyTransactionSummary :date="date.toString()" :transactions="transactionOnDay"/>
      <div class="grid grid-cols-1 gap-4">
        <Transaction v-for="tran in transactionOnDay" :key="tran.id" :tran="tran" @deleted="refreshTransactions"/>
      </div>
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { transactionViewOptions} from '@/constants'

type Transaction = {
  id: string,
  amount: number,
  description: string,
  category: string,
  timestamp: string,
  type: string
}

const selectedView = ref(transactionViewOptions[1])
const supabase = useSupabaseClient()
const transactions =  ref<Transaction[]>([])
const isLoading = ref(false)


// Fetch transactions
const fetchTransactions = async () => {
  isLoading.value = true
  try {
    const { data } = await useAsyncData('transactions', async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select()
      if (error) return []
      return data
    })
    return data.value || []
  } finally {
    isLoading.value = false
  }

}


const refreshTransactions = async () => transactions.value = await fetchTransactions()

await refreshTransactions()

const income = computed(() => transactions.value.filter(tran => tran.type === 'income'))
const expense = computed(() => transactions.value.filter(tran => tran.type === 'expense'))
const incomeCount = computed(() => income.value.length)
const expenseCount = computed(() => expense.value.length)
const incomeTotal = computed(() => income.value.reduce((acc, tran) => acc + tran.amount, 0))
const expenseTotal = computed(() => expense.value.reduce((acc, tran) => acc + tran.amount, 0))

const transactionsGroupByDate = computed(() => {
  let grouped: { [key: string]: any[] } = {}
  for(const tran of transactions.value) {
    const date = new Date(tran.timestamp).toISOString().split('T')[0]
    if(!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(tran)
  }
  return grouped;
})


</script>

<style>

</style>