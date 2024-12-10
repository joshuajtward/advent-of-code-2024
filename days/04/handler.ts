import { readFileSync } from "fs";

const parseInput = (filename: string) =>
  readFileSync(`${__dirname}/input/${filename}.txt`, "utf-8").split("\n");

const horizontal = (lines: string[]) => lines;

const vertical = (lines: string[]) =>
  lines
    .reduce(
      (output, line) => {
        line.split("").forEach((char, pos) => {
          output[pos].push(char);
        });
        return output;
      },
      Array.from(Array(lines[0].length)).map(() => [])
    )
    .map((line) => line.join(""));

if (import.meta.vitest) {
  it("calculates the vertical", () => {
    expect(vertical(["SXS", "SAA", "MMM", "MAS"])).toEqual([
      "SSMM",
      "XAMA",
      "SAMS",
    ]);
  });
}

const diagFor = (lines: string[]) => {
  const maxY = lines[0].length; // aka width
  const maxX = lines.length + maxY - 1; // aka depth

  let output: Record<number, [number, number][]> = {};
  for (let d = maxX; d >= 0; d--) {
    for (let n = d; n >= 0; n--) {
      const i = d - n;
      if (i < maxY && n < lines.length) {
        if (!output[d]) output[d] = [];
        output[d].push([i, n]);
      }
    }
  }

  return Object.values(output).map((line) =>
    line.reduce((string, [x, y]) => string + lines?.[y]?.[x], "")
  );
};

if (import.meta.vitest) {
  it("calculates the forward diag", () => {
    const result = diagFor(["SXS", "SAA", "MMM", "MAS"]);
    expect(result).toEqual(["S", "SX", "MAS", "MMA", "AM", "S"]);
  });
}

const diagBack = (lines: string[]) => diagFor(lines.reverse());

if (import.meta.vitest) {
  it("calculates the backward diag", () => {
    const result = diagBack(["SXS", "SAA", "MMM", "MAS"]);
    expect(result).toEqual(["M", "MA", "SMS", "SAM", "XA", "S"]);
  });
}

const calc = (input: string[]) =>
  input.reduce(
    (total, line) =>
      total +
      (line.match(/XMAS/g)?.length || 0) +
      (line.match(/SAMX/g)?.length || 0),
    0
  );

if (import.meta.vitest) {
  it("should work with the first test input", () => {
    const testInput = parseInput("test");
    const directions = [horizontal, vertical, diagFor, diagBack];

    const total = directions.reduce(
      (acc, input) => acc + calc(input(testInput)),
      0
    );
    expect(total).toEqual(18);
  });

  it("should work with the first puzzle input", () => {
    const testInput = parseInput("input");
    const directions = [horizontal, vertical, diagFor, diagBack];

    const total = directions.reduce(
      (acc, input) => acc + calc(input(testInput)),
      0
    );
    expect(total).toEqual(2517);
  });
}

const x = (input: string[]) => {
  const map = input.map((line) => line.split(""));
  let total = 0;
  map.forEach((line, i) => {
    line.forEach((char, pos) => {
      if (char === "A") {
        const a = map[i - 1]?.[pos - 1];
        const b = map[i - 1]?.[pos + 1];
        const c = map[i + 1]?.[pos - 1];
        const d = map[i + 1]?.[pos + 1];

        if (["SM", "MS"].includes(a + d) && ["SM", "MS"].includes(b + c)) {
          total += 1;
        }
      }
    });
  });
  return total;
};

if (import.meta.vitest) {
  it("should work with the first test input with the second criteria", () => {
    const testInput = parseInput("test");

    const total = x(testInput);
    expect(total).toEqual(9);
  });

  it("should work with the first puzzle input with the second criteria", () => {
    const testInput = parseInput("input");
    const total = x(testInput);
    expect(total).toEqual(1960);
  });
}
