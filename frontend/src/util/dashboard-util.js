export const getProfit = (data) => {
  let profit

  for (const transaction of data) {
    profit += transaction.payment
  }

  return profit
}
