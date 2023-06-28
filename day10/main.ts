import fs from "fs";

function readFile(filename = "example.txt") {
  return new Promise((res, rej) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) return rej(err);
      res(data);
    });
  });
}

type Instruction = {
  action: "addX" | "noop";
  value: number;
  cyclesRemaining: number;
};

type State = { x: number; cycle: number };

function solvePart1(data: string) {
  const instructions = parseInstructions(data);
  let state = { x: 1, cycle: 0 };
  let result = 0;
  let current = instructions.shift();
  while (current) {
    const { signalStrength, state: newState } = runInstruction(current, state);
    state = newState;
    result += signalStrength;
    current = instructions.shift();
  }
  return result;
}

function runInstruction(instruction: Instruction, { x, cycle }: State) {
  const { value, cyclesRemaining } = instruction;
  let signalStrength = 0;
  for (let i = cyclesRemaining; i > 0; i--) {
    cycle++;
    signalStrength += calculateSignalStrength({ x, cycle });
  }
  return { signalStrength, state: { x: x + value, cycle } };
}

function calculateSignalStrength({ x, cycle }: State) {
  if ((cycle + 20) % 40 === 0) return cycle * x;
  return 0;
}

function parseInstructions(data: string) {
  return data
    .split(/\n/g)
    .map((e) => e.split(" "))
    .map(([action, value]) => ({
      action,
      value: value ? Number(value) : 0,
      cyclesRemaining: action === "addx" ? 2 : 1,
    })) as Instruction[];
}

//"final.txt"
readFile("./final.txt")
  .then((v) => solvePart1(v as string))
  .then(console.log);
