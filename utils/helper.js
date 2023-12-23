const make_transactions_list = (arr, id) => {
  let transactions_list = [];
  arr.forEach((transaction) => {
    console.log(transaction.from_id)
    if (transaction.from_id.equals(id)) {
      transactions_list.push({
        mode: "debit",
        currentAmount: transaction.snd_BankBalance,
        previousAmount: transaction.snd_BankBalance + transaction.amount,
      });
    } else {
      transactions_list.push({
        mode: "credit",
        currentAmount: transaction.snd_BankBalance,
        previousAmount: transaction.snd_BankBalance - transaction.amount,
      });
    }
  });
  return transactions_list;
};

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const haswonCoupon = () => {
  if (generateRandomNumber(1, 20) === 9) return true;
  return false;
};

const cashback_helper = (amount, bankBalance) => {
  let msg,
    cashbackAmount = 0;
  if (amount % 500 === 0 && haswonCoupon()) {
    msg = "Congrats you have won a coupon";
  } else if (amount % 500 === 0) {
    msg = "Better Luck Next time";
  } else if (amount < 1000) {
    cashbackAmount = amount * 0.05;
    msg =
      "Congrats you have won a cashback of " +
      cashbackAmount +
      ", Cashback has been credited to your account" +
      ", Available Bank Balance: " +
      bankBalance;
  } else if (amount > 1000) {
    cashbackAmount = amount * 0.02;
    msg =
      "Congrats you have won a cashback of " +
      cashbackAmount +
      ", Cashback has been credited to your account" +
      ", Available Bank Balance: " +
      bankBalance;
  }
  return { msg, cashbackAmount };
};

module.exports = { make_transactions_list, cashback_helper };