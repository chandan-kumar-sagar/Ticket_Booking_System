const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

exports.addMoney = async (req, res) => {
  try {
    const userId = req.user.id;
    const amount = Number(req.body.amount);

    // ✅ Validation
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    // ✅ Create wallet if not exists (1 wallet per user)
    let wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount } }, // atomic update
      { new: true, upsert: true } //  creates if not exists
    );

    // ✅ Create transaction record
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
      .populate("userId", "name email role") // 🔥 show user details
      .sort({ createdAt: -1 }); // latest first

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
    console.log("User ID:", req.user.id); // DEBUG

    const transactions = await Transaction.find({
      userId: req.user.id   // MUST MATCH ABOVE
    }).sort({ createdAt: -1 });

    console.log("Transactions:", transactions);

    res.json(transactions);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
