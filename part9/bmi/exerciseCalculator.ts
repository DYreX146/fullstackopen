interface ExerciseValues {
  target: number;
  dailyExerciseHours: number[];
}

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) {
    throw new Error("Must provide at least 2 arguments");
  }

  const values: number[] = [];

  for (let i = 2; i < args.length; ++i) {
    const value = Number(args[i]);

    if (isNaN(value)) {
      throw new Error("Provided values were not numbers!");
    }

    values.push(value);
  }

  return {
    target: values[0],
    dailyExerciseHours: values.slice(1)
  };
};

export const calculateExercises = (dailyExerciseHours: number[], target: number): Result => {
  let trainingDays = 0;
  let totalHours = 0;

  for (let i = 0; i < dailyExerciseHours.length; ++i) {
    totalHours += dailyExerciseHours[i];

    if (dailyExerciseHours[i] > 0) {
      ++trainingDays;
    }
  }

  const average = totalHours / dailyExerciseHours.length;
  const targetDifference = average - target;
  let rating = 0;
  let ratingDescription = "";

  if (Math.abs(targetDifference) < 0.5) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else if (targetDifference >= 0.5) {
    rating = 3;
    ratingDescription = "well done, you beat your daily target by more than 30 minutes";
  } else {
    rating = 1;
    ratingDescription = "you fell short of your target by more than 30 minutes, better luck next time";
  }

  return {
    periodLength: dailyExerciseHours.length,
    trainingDays,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average
  };
};

if (require.main === module) {
  try {
    const { target, dailyExerciseHours } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(dailyExerciseHours, target));
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
