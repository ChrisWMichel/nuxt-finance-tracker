export const useFetchTransactions = (period) => {
  const isNewRecord = ref(false);
  const modalMessage = ref("");
  const showModal = ref(false);
  const supabase = useSupabaseClient();
  const transactions = ref([]);
  const isLoading = ref(false);
  const isOpen = ref(false);

  const income = computed(() =>
    transactions.value.filter((tran) => tran.type === "Income")
  );
  const expense = computed(() =>
    transactions.value.filter((tran) => tran.type === "Expense")
  );
  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);
  const incomeTotal = computed(() =>
    income.value.reduce((acc, tran) => acc + tran.amount, 0)
  );
  const expenseTotal = computed(() =>
    expense.value.reduce((acc, tran) => acc + tran.amount, 0)
  );

  // Fetch transactions
  const fetchTransactions = async () => {
    isLoading.value = true;
    try {
      const { data } = await useAsyncData("transactions", async () => {
        const { data, error } = await supabase
          .from("transactions")
          .select()
          .order("timestamp", { ascending: false });
        if (error) return [];
        return data;
      });
      if (isNewRecord.value) {
        modalMessage.value = "New record added successfully";
        showModal.value = true;
      }

      return data.value || [];
    } finally {
      isLoading.value = false;
      if (isNewRecord.value) {
        setTimeout(() => {
          showModal.value = false;
          isNewRecord.value = false;
        }, 2000);
      }
      isOpen.value = false;
    }
  };

  const refresh = async () => (transactions.value = await fetchTransactions());

  const transactionsGroupByDate = computed(() => {
    let grouped = {};
    for (const tran of transactions.value) {
      const date = new Date(tran.timestamp).toISOString().split("T")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(tran);
    }
    return grouped;
  });

  return {
    isNewRecord,
    modalMessage,
    showModal,
    transactions,
    isLoading,
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    isOpen,
    refresh,
    transactionsGroupByDate,
  };
};
