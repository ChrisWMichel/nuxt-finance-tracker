<template>
  <div>
    <div class="font-bold" :class="[color]">{{ title }}</div>

    <div class="text-2xl font-extrabold text-black dark:text-white mb-2" :class="[trendingUp ? 'green' : 'red']">
      <USkeleton class="h-8 w-full" v-if="loading" />
      <span v-else>{{ currency }}</span>
    </div>

    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon :name="icon" class="w-6 h-6" :class="{'green': trendingUp, 'red': !trendingUp}" />
          <div class="text-gray-500 dark:text-gray-400">
            {{percentageTrend}}% from last month
          </div>
      </div>
    </div>
  </div>
</template>
<!-- trendingUp ? 'green' : 'red' -->
<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps<{
  title: string,
  amount: number,
  lastAmount: number,
  color: string
  loading: boolean
}>()

const trendingUp = computed(() => props.amount > props.lastAmount)
const icon = computed(() => trendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down')

const amountRef = ref(props.amount)
const currency = useCurrency(amountRef)

const percentageTrend = computed(() => {
  if(props.lastAmount === 0 || props.amount === 0) return '\u221E'
  const diff = props.amount - props.lastAmount
  return Math.round(Math.abs((diff / props.lastAmount) * 100))
}) 

</script>

<style scoped>

.green {
  @apply text-green-600 dark:text-green-400;
}
.red{
  @apply text-red-600 dark:text-red-400;
}

</style>