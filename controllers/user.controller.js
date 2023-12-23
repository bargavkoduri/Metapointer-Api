const User = require("../models/User.model");
const Transaction = require("../models/transactions.model");
const redisClient = require("../utils/redis_connection");
const { make_transactions_list, cashback_helper } = require("../utils/helper");
const { mongoose } = require("../utils/db");

// Returns phone number and balance of a user
exports.getInfo = async (req, res) => {
  try {
    const { id } = req.params;
    let cachedResults = await redisClient.get(id);
    if (cachedResults) {
      cachedResults = JSON.parse(cachedResults);
      res.status(200).send(cachedResults);
    } else {
      let userDetails = await User.findById(id, {
        phoneNumber: 1,
        balance: 1,
        _id: 0,
      });
      // caching user details
      await redisClient.set(id, JSON.stringify(userDetails), {
        EX: 3600,
      });
      res.status(200).send(userDetails);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      msg: "Unable to process request",
    });
  }
};

// Returns list of all successful transactions by the user
exports.getTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    let cachedResults = await redisClient.get(id + "-transactions");
    if (cachedResults) {
      cachedResults = JSON.parse(cachedResults);
      res.status(200).send(cachedResults);
    } else {
      let { transactions } = await User.findById(id, {
        transactions: 1,
      }).populate({
        path: "transactions",
        options: {
          sort: {
            createdAt: -1,
          },
        },
      });
      transactions = make_transactions_list(transactions, id);
      // caching results
      await redisClient.set(
        id + "-transactions",
        JSON.stringify(transactions),
        {
          EX: 3600,
        }
      );
      res.status(200).send(transactions);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      msg: "Unable to process request",
    });
  }
};

// Transactions
exports.processTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction({
    readPreference: "primary",
    readConcern: { level: "snapshot" },
  });
  try {
    const { id } = req.params;
    const opts = { session };
    const sender = await User.findById(id);
    if (sender.phoneNumber === req.body.phoneNumber) {
      throw new Error("Sender and Reciver can't be same");
    }
    req.body.amount = parseFloat(req.body.amount);
    if (sender.balance < req.body.amount) {
      throw new Error("Insufficient Balance");
    }
    if (req.body.amount < 0) {
      throw new Error("Transfer Amount should be greater than zero");
    }
    const receiver = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (!receiver) {
      throw new Error(
        "No user found with phone number: " + req.body.phoneNumber
      );
    }
    const newTransactionRecord = new Transaction({
      from_id: sender._id,
      to_id: receiver._id,
      amount: req.body.amount,
      to_phoneNumber: req.body.phoneNumber,
      from_phoneNumber: sender.phoneNumber,
      snd_BankBalance: sender.balance - req.body.amount,
      rec_BankBalance: receiver.balance + req.body.amount,
    });
    // Checking for coupon or cashback amount
    let { msg, cashbackAmount } = cashback_helper(
      req.body.amount,
      newTransactionRecord.snd_BankBalance
    );
    newTransactionRecord.snd_BankBalance += cashbackAmount
    // creating a new transaction
    const newTransaction = await newTransactionRecord.save(opts);
    // Updating transaction details in sender and receiver
    await User.updateOne(
      { _id: sender._id },
      {
        $push: { transactions: newTransaction._id },
        $set: { balance: sender.balance - req.body.amount + cashbackAmount },
      },
      opts
    );

    await User.updateOne(
      { _id: receiver._id },
      {
        $push: { transactions: newTransaction._id },
        $set: { balance: receiver.balance + req.body.amount },
      },
      opts
    );

    await redisClient.del(id + "-transactions");
    await redisClient.del(id);
    await redisClient.del(toString(receiver._id) + "-transactions");
    await redisClient.del(toString(receiver._id));

    await session.commitTransaction();
    session.endSession();
    res.status(201).send({
      msg: "Transaction Successful",
      cashback: msg,
    });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).send(err);
  }
};
