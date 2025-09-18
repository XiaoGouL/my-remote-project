export const formatPrice = (price: number | null) => {
  if (price === null) return 'N/A';
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatNumber = (num: number) => {
  if (num === null) return 'N/A';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};