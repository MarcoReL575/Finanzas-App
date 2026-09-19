// Convierte centavos a formato de moneda local
export const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(cents / 100);
};