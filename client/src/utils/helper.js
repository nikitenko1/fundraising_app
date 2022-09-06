export const dateFormatter = (date) => {
  let result = '';

  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const unformattedDate = date.substring(0, 10);
  const splittedDate = unformattedDate.split('-');

  result =
    splittedDate[2] +
    ' ' +
    month[Number(splittedDate[1]) - 1] +
    ' ' +
    splittedDate[0];

  return result;
};

export const currencyFormatter = (amount) => {
  let formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(amount);
};
