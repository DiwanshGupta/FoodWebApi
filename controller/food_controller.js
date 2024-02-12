import Food from "../model/food-schema.js";

export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createFood = async (req, res) => {
  try {
    const createdFood = await Food.create(req.body);
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      res.status(200).json(food);
    } else {
      res.status(404).json({ message: "Food item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateFoodById = async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteFoodById = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getFoodByHolemark = async (req, res) => {
  try {
    const holemark = req.query.holemark;
    const foods = await Food.find({ holemark });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getFoodByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    const foods = await Food.find({ category });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
