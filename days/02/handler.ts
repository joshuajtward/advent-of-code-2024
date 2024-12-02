import { readFileSync } from "fs";

const parseInput = (filename: string) =>
  readFileSync(`${__dirname}/input/${filename}.txt`, "utf-8")
    .trim()
    .split("\n")
    .map((line) => line.split(" ").map((str) => parseInt(str)));

const calculateGaps = (report: number[]) =>
  report.reduce((gapArray, level, i) => {
    if (i < report.length - 1) gapArray.push(report[i + 1] - level);
    return gapArray;
  }, [] as number[]);

if (import.meta.vitest) {
  describe("calculateGaps", () => {
    it("calulates the gaps between the numbers", () => {
      expect(calculateGaps([1, 2, 3, 4, 5])).toEqual([1, 1, 1, 1]);
      expect(calculateGaps([1, 3, 2, 4, 5])).toEqual([2, -1, 2, 1]);
      expect(calculateGaps([1, 1, 1, 1, 1])).toEqual([0, 0, 0, 0]);
    });
  });
}

const isSafe = (report: number[]) => {
  const type = report[0] > report[1] ? "desc" : "asc";
  const gaps = calculateGaps(report);

  const withinLimit = !gaps.some((gap) => Math.abs(gap) > 3);
  const homogenous =
    type === "asc"
      ? !gaps.some((gap) => gap <= 0)
      : !gaps.some((gap) => gap >= 0);

  return homogenous && withinLimit;
};

const isSafeWithProblemDampener = (report: number[]) => {
  for (let i = 0; i < report.length; i++) {
    if (isSafe(report)) return true;
    const newReport = [...report];
    delete newReport[i];
    if (isSafe(newReport.filter(Boolean))) return true;
  }

  return false;
};

if (import.meta.vitest) {
  describe("isSafe", () => {
    it("works for the test input", () => {
      const result = parseInput("test").map(isSafe);
      expect(result).toEqual([true, false, false, false, false, true]);
      expect(result.filter(Boolean).length).toBe(2);
    });

    it("works for the first puzzle", () => {
      const result = parseInput("input").map(isSafe);
      expect(result.filter(Boolean).length).toBe(279);
    });
  });

  describe("isSafeWithProblemDampener", () => {
    it("works for the test input", () => {
      const result = parseInput("test").map(isSafeWithProblemDampener);
      expect(result).toEqual([true, false, false, true, true, true]);
      expect(result.filter(Boolean).length).toBe(4);
    });

    it("works for the first puzzle", () => {
      const result = parseInput("input").map(isSafeWithProblemDampener);
      expect(result.filter(Boolean).length).toBe(343);
    });
  });
}
