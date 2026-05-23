const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

exports.addMoney = async (req, res) => {
  try {
    const userId = req.user.id;
    const amount = Number(req.body.amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

   
    let wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } }, 
      { new: true, upsert: true } 
    );

    await Transaction.create({
      userId,
      type: "credit",
      amount,
      balanceAfter: wallet.balance
    });

    res.json({
      message: "Money added successfully",
      balance: wallet.balance
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("userId", "name email role") 
      .sort({ createdAt: -1 });

    res.json({
      message: "Transactions fetched successfully",
      total: transactions.length,
      transactions
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    console.log("User ID:", req.user.id); 

    const transactions = await Transaction.find({
      userId: req.user.id   
    }).sort({ createdAt: -1 });

    console.log("Transactions:", transactions);

    res.json(transactions);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
