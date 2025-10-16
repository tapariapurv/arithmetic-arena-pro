import { Difficulty, Operation, Question } from "@/types/game";

export const getNumberRange = (difficulty: Difficulty): { min: number; max: number } => {
  switch (difficulty) {
    case "easy":
      return { min: 1, max: 10 };
    case "medium":
      return { min: 1, max: 50 };
    case "hard":
      return { min: 1, max: 100 };
  }
};

export const generateQuestion = (difficulty: Difficulty): Question => {
  const { min, max } = getNumberRange(difficulty);
  const operations: Operation[] = ["+", "-", "×", "÷"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  let answer: number;

  switch (operation) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      // Ensure no negative results
      if (num1 < num2) [num1, num2] = [num2, num1];
      answer = num1 - num2;
      break;
    case "×":
      // Smaller numbers for multiplication
      num1 = Math.floor(Math.random() * (Math.min(max, 12) - min + 1)) + min;
      num2 = Math.floor(Math.random() * (Math.min(max, 12) - min + 1)) + min;
      answer = num1 * num2;
      break;
    case "÷":
      // Ensure division results in whole numbers
      num2 = Math.floor(Math.random() * (Math.min(max, 12) - min + 1)) + min;
      answer = Math.floor(Math.random() * (Math.min(max, 12) - min + 1)) + min;
      num1 = num2 * answer;
      break;
  }

  return { num1, num2, operation, answer };
};

export const checkAnswer = (userAnswer: number, correctAnswer: number): boolean => {
  return userAnswer === correctAnswer;
};
