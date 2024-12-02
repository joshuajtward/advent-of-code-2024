import { readFileSync } from "fs";

const parseInput = (filename: string) =>
  readFileSync(`${__dirname}/input/${filename}.txt`, "utf-8")
    .trim()
    .split("\n")
    .map((line) => line.split("   ").map((str) => parseInt(str)));

const calculateDistance = (input: number[][]) => {
  const leftNumbers = input.map((line) => line[0]).sort((a, b) => a - b);
  const rightNumbers = input.map((line) => line[1]).sort((a, b) => a - b);

  return rightNumbers.reduce(
    (total, num, i) => (total += Math.abs(num - leftNumbers[i])),
    0
  );
};

if (import.meta.vitest) {
  describe("calculateDistance", () => {
    it("works for the test input", () => {
      expect(calculateDistance(parseInput("test"))).toEqual(11);
    });

    it("works for the first puzzle", () => {
      expect(calculateDistance(parseInput("input"))).toEqual(2815556);
    });
  });
}

const caclulateSimilarity = (input: number[][]) => {
  const leftNumbers = input.map((line) => line[0]);
  const rightNumbers = input.map((line) => line[1]);

  return leftNumbers.reduce((total, num) => {
    const timesInRight = rightNumbers.reduce(
      (count, rightNum) => (rightNum === num ? count + 1 : count),
      0
    );

    return total + timesInRight * num;
  }, 0);
};

if (import.meta.vitest) {
  describe("caclulateSimilarity", () => {
    it("works for the test input", () => {
      expect(caclulateSimilarity(parseInput("test"))).toEqual(31);
    });

    it("works for the first puzzle", () => {
      expect(caclulateSimilarity(parseInput("input"))).toEqual(23927637);
    });
  });
}
