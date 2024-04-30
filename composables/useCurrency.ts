import type { Ref } from 'vue';

export const useCurrency = (amount: Ref<number>) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });
    return formatter.format(isRef(amount) ? amount.value : amount);
}