import { listaGastos } from "@/src/category";

export function getCategoryInfo(categoryValue: string) {
    const category = listaGastos.find((cat) => cat.value === categoryValue);
    return category || {
        label: categoryValue,
        icon: null,
        value: categoryValue,
    };
}