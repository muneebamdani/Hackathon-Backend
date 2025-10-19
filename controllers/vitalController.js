import Vital from "../models/Vital.js";

export const addVital = async (req, res, next) => {
  try {
    const { bp, sugar, weight, notes, date } = req.body;

    if (!bp && !sugar && !weight) {
      return res.status(400).json({ message: "At least one vital should be provided" });
    }

    const vital = new Vital({
      userId: req.user._id,
      bp,
      sugar,
      weight,
      notes,
      date: date ? new Date(date) : undefined,
    });

    await vital.save();
    res.status(201).json(vital);
  } catch (err) {
    next(err);
  }
};

export const getVitals = async (req, res, next) => {
  try {
    const vitals = await Vital.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(vitals);
  } catch (err) {
    next(err);
  }
};
