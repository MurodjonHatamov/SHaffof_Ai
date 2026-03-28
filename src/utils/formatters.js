// src/utils/formatters.js

export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatAmount = (amount) => {
  return Number(amount).toLocaleString('uz-UZ') + " so‘m";
};

