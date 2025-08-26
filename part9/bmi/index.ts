import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

import express from "express";
const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => { 
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: "malformatted parameters" });
    return;
  }

  const bmi = calculateBmi(height, weight);

  res.send({ weight, height, bmi });
});

app.post("/exercises", (req, res) => {
  const dailyExerciseHours = req.body.daily_exercises;
  const target = req.body.target;

  if (!dailyExerciseHours || !target) {
    res.status(400).send({ error: "parameters missing" });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const areNumbers = (array: any[]): boolean => {
    for (let i = 0; i < array.length; ++i) {
      if (isNaN(Number(array[i]))) {
        return false;
      }
    }

    return true;
  };

  if (isNaN(Number(target)) || !Array.isArray(dailyExerciseHours) || !areNumbers(dailyExerciseHours)) {
    res.status(400).send({ error: "malformatted parameters" });
    return;
  }

  res.send(calculateExercises(dailyExerciseHours as number[], target as number));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});