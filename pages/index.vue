<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelect v-model="selectedView" :options="transactionViewOptions"/>
    </div>
  </section>
  <AppModal v-if="showModal">{{ modalMessage }}</AppModal>
  <section class="grid grid-cols-2 gap-10 mb-10 md:grid-cols-2 sm:gap-16 justify-items-center">
    <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="prevIncomeTotal" :loading="isLoading"/>
    <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="prevExpenseTotal" :loading="isLoading"/>
    <!-- <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="isLoading"/>
    <Trend color="red" title="Savings" :amount="4000" :last-amount="4500" :loading="isLoading"/> -->
  </section>

  <section class="flex justify-between mb-10">
    <div class="flex items-center justify-between mb-10">
      <h3 class="pr-2 text-lg font-extrabold">Transactions:</h3>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} income and {{ expenseCount }} expense transactions this period.
      </div>
    </div>
    <div>
      <AddDataModal @newSubmit="refresh()" @newData="isNewRecord = true" v-model="isOpen"/>
       <UButton icon="i-heroicons-plus-circle" variant="solid" @click="isOpen = true" >Add</UButton>
    </div>
  </section>

  <section v-if="!isLoading">
    <div v-for="(transactionOnDay, date) in transactionsGroupByDate" :key="date" class="mb-10">
      <DailyTransactionSummary :date="date.toString()" :transactions="transactionOnDay"/>
      <div class="grid grid-cols-1 gap-4">
        <Transaction v-for="tran in transactionOnDay" :key="tran.id" :tran="tran" @deleted="refresh()" @updated="refresh()"/>
      </div>
    </div>
  </section>
  <section v-else>
    <USkeleton class="w-full h-8 mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions} from '@/constants'
const user = useSupabaseUser()
const selectedView = ref(user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1])
const {current, previous} = useSelectedTimePeriod(selectedView)

const {
    isNewRecord,
    modalMessage,
    showModal,
    isLoading,
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    isOpen,
    refresh,
    transactionsGroupByDate
} = useFetchTransactions(current)
await refresh()

const {
  refresh: prevRefresh,
  incomeTotal: prevIncomeTotal,
  expenseTotal: prevExpenseTotal,
} = useFetchTransactions(previous) 
await prevRefresh()









</script>

<style>

</style>