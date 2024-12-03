import { readFileSync } from "fs";

const parseInput = (filename: string) =>
  readFileSync(`${__dirname}/input/${filename}.txt`, "utf-8")
    .split("\n")
    .join("");

const calc = (input: string) => {
  const regex = /mul\(\d*,\d*\)/g;

  const matches = input.match(regex);

  return matches.reduce((total, value) => {
    const valueRegex = /mul\((\d{1,3}),(\d{1,3})\)/;
    total +=
      parseInt(value.match(valueRegex)[1]) *
      parseInt(value.match(valueRegex)[2]);

    return total;
  }, 0);
};

if (import.meta.vitest) {
  it("should work with the first test input", () => {
    expect(calc(parseInput("test"))).toEqual(161);
  });
  it("should work with the first puzzle input", () => {
    expect(calc(parseInput("input"))).toEqual(167090022);
  });
}

const trimInput = (input: string) => {
  const { result } = input.split("don't()").reduce(
    (output, value, i) => {
      if (output.do) {
        return { result: output.result + value, do: false };
      }

      if (!output.do && value.includes("do()")) {
        const newValue = value.split("do()");
        newValue.shift();

        return {
          result: output.result + "do()" + newValue.join("do()"),
          do: false,
        };
      }

      return output;
    },
    { result: "", do: true }
  );

  return result;
};

if (import.meta.vitest) {
  it("should work with the second test input", () => {
    const trimmedInput = trimInput(parseInput("test2"));
    expect(calc(trimmedInput)).toEqual(48);
  });

  it("should work with the first puzzle input including the second puzzle criteria", () => {
    const trimmedInput = trimInput(parseInput("input"));
    expect(calc(trimmedInput)).toEqual(89823704);
  });
}
