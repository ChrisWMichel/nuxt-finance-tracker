<template>
  <div>
    <!--  @close="emit('close')" -->
    <UModal v-model="isOpen" >
      <UCard>
        <template #header>
          Add Transaction
        </template>
          <UForm :state="newData" :schema="schema" ref="form" @submit="addData">
            <UFormGroup label="Transaction Type" :required="true" name="type" class="mb-4">
            <USelect placeholder="Transaction Type" v-model="newData.type" :options="types" />
          </UFormGroup>
          <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
            <UInput placeholder="Amount" type="number" v-model.number="newData.amount"/>
          </UFormGroup>
          <UFormGroup label="Transaction Date" :required="true" name="timestamp" class="mb-4">
            <UInput icon="i-heroicons-calendar-days-20-solid" type="date" v-model="newData.timestamp"/>
          </UFormGroup>
          <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
            <UInput placeholder="Description" type="text" v-model="newData.description"/>
          </UFormGroup>
          <UFormGroup label="Category" :required="true" name="category" class="mb-4" v-if="newData.type === 'Expense'">
            <USelect v-model="newData.category" :options="categories" placeholder="Category"/>
          </UFormGroup>
          <div class="flex justify-center">
            <UButton type="submit" color="black" variant="solid" label="Save" :loading="isLoading"/>
          </div>
          </UForm>
        
       
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { categories, types } from '~/constants';
import {z} from 'zod'
const supabase = useSupabaseClient()
const props = defineProps({
  modelValue: Boolean
})

const isLoading = ref(false)

const emit = defineEmits(['newSubmit', 'update:modelValue'])

const initialState = {
  amount: 0,
  timestamp: '',
  description: '',
  category: '',
  type: ''
}

const newData = ref({
  ...initialState
})

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) {
      resetForm()
    }
    emit('update:modelValue', value)
  }
})

const defaultSchema = z.object({
  timestamp: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  type: z.string().refine(value => value !== '', 'Field cannot be empty'),
  category: z.string().optional(),
})

const incomeSchema = z.object({
  type: z.literal('Income'),
});
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(categories),
});

const schema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema]),
  defaultSchema
);

const form = ref()

let transaction = reactive({ ...initialState });
const resetForm = () => {
  Object.assign(newData.value, initialState)
  Object.keys(initialState).forEach(key => {
    transaction[key] = initialState[key];
  });
}

const addData = async () => {
  if(form.value.errors.length) return

  console.log('timestamp:', typeof transaction.timestamp);
console.log('description:', typeof transaction.description);
console.log('type:', typeof transaction.type);
console.log('category:', typeof transaction.category);
  // Add data to the database
  
   try{
    const {error} = await supabase.from('transactions').upsert({...newData.value})
    if (error) {
      console.error('Failed to add data', error);
    } else {
      console.log('Data added successfully');
      emit('newSubmit');
      emit( 'newData')
    }
   }
    catch(error){
      console.log('Validation failed', error)
    } finally {
      isLoading.value = false
    }
}


</script>

<style scoped>
.style-input {
  @apply mb-5;
}
</style>