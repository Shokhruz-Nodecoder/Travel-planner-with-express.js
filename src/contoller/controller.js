const Io = require("../utils/io");
const Tour = new Io("./database/travels.json");
const Travel = require("../models/tour.js");
const Joi = require("joi");

const addTour = async (req, res) => {
  try {
    const { destination, cost, startDate, duration } = req.body;

    const schema = Joi.object({
      destination: Joi.string().alphanum().required(),
      cost: Joi.number().required(),
      startDate: Joi.date().iso().required(),
      duration: Joi.number().min(0).required(),
    });

    const { error } = schema.validate({
      destination,
      cost,
      startDate,
      duration,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const tour = await Tour.read();
    const id = (tour[tour.length - 1]?.id || 0) + 1;

    function addDaysToDate(dateStr, number) {
      try {
        const [year, month, day] = dateStr.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + number);
        const updatedYear = date.getFullYear();
        const updatedMonth = (date.getMonth() + 1).toString().padStart(2, "0");
        const updatedDay = date.getDate().toString().padStart(2, "0");
        return `${updatedYear}-${updatedMonth}-${updatedDay}`;
      } catch (error) {
        return "Invalid date format. Please use 'YYYY-MM-DD'.";
      }
    }

    const enddate = addDaysToDate(startDate, +duration);
    // console.log(`Updated date: ${updatedDate}`);

    const newTravel = new Travel(
      id,
      destination,
      cost,
      startDate,
      duration,
      enddate
    );

    const data = tour.length ? [...tour, newTravel] : [newTravel];

    const apex = tour.some(
      (data) =>
        data.destination === destination &&
        data.startDate === startDate &&
        data.duration === duration &&
        data.cost === cost
    );
    if (apex) return res.status(500).json({ message: "Already added" });

    await Tour.write(data);

    res.status(201).json({ message: "Successfully added", tour });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const showTour = async (req, res) => {
  const tour = await Tour.read();
  return res.status(200).json({ message: "Show list is seen", tour });
};

const findSuitabel = async (req, res) => {
  try {
    const { cost, startDate, duration } = req.body;
    const schema = Joi.object({
      cost: Joi.number().required(),
      startDate: Joi.date().iso().required(),
      duration: Joi.number().min(0).required(),
    });

    const { error } = schema.validate({
      cost,
      startDate,
      duration,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const tour = await Tour.read();

    function addDaysToDate(dateStr, number) {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      date.setDate(date.getDate() + number);
      const updatedYear = date.getFullYear();
      const updatedMonth = (date.getMonth() + 1).toString().padStart(2, "0");
      const updatedDay = date.getDate().toString().padStart(2, "0");
      return `${updatedYear}-${updatedMonth}-${updatedDay}`;
    }

    const enddate = addDaysToDate(startDate, +duration);
    console.log(`tour enddate: ${enddate}`);

    const matchingTours = tour.filter((travel) => {
      return (
        travel.cost <= cost &&
        new Date(travel.startDate) >= new Date(startDate) &&
        new Date(travel.enddate) <= new Date(enddate)
      );
    });

    if (matchingTours.length === 0) {
      return res.status(404).json({ message: "No matching tours found" });
    }

    res.status(200).json({ tours: matchingTours });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  addTour,
  showTour,
  findSuitabel,
};
