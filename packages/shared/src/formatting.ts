export const formatCompactCurrency = (num: number) => {
  return compactCurrency.format(num);
};

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
});
