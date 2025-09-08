export const formatNumber = (num, options) => {
  const formatter = new Intl.NumberFormat('en-US', {
   
    currency: options?.style === 'currency' ? options?.currency : undefined
  });
  return formatter.format(num);
};