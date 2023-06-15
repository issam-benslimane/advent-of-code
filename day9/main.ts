import fs from "fs";
import { LinkedList } from "./dll";
import { Position } from "./Position";

function readFile(filename = "example.txt") {
  return new Promise((res, rej) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) return rej(err);
      res(data);
    });
  });
}

type Knot = {
  position: Position;
  visits: Set<string>;
};

function solvePart2(data: string) {
  const directions = parseData(data);
  const knots = createKnots(9);
  for (let [direction, steps] of directions) {
    while (steps > 0) {
      const head = knots.head;
      if (!head) return;
      knots.set(0, {
        position: head.value.position.plus(direction),
        visits: head.value.visits.add(
          `${head.value.position.x},${head.value.position.y}`
        ),
      });
      let currentKnot = head;
      for (let i = 1; i < knots.length; i++) {
        const nextKnot = currentKnot.next;
        if (!nextKnot) break;
        const stepsBetween = currentKnot.value.position.minus(
          nextKnot.value.position
        );

        if (stepsBetween.abs().x < 2 && stepsBetween.abs().y < 2) break;
        if (stepsBetween.abs().x > 0 && stepsBetween.abs().y > 0) {
          let diagonal = new Position(1, 1);
          if (stepsBetween.x < 0)
            diagonal = diagonal.times(new Position(-1, 1));
          if (stepsBetween.y < 0)
            diagonal = diagonal.times(new Position(1, -1));
          knots.set(i, {
            position: nextKnot.value.position.plus(diagonal),
            visits: nextKnot.value.visits.add(
              `${nextKnot.value.position.x},${nextKnot.value.position.y}`
            ),
          });
        } else {
          knots.set(i, {
            position: nextKnot.value.position.plus(direction),
            visits: nextKnot.value.visits.add(
              `${nextKnot.value.position.x},${nextKnot.value.position.y}`
            ),
          });
        }
        currentKnot = nextKnot;
      }
      steps--;
    }
  }
  return knots.tail?.value.visits.size;
}

function serialize<T>(ll: LinkedList<T>) {
  const result: T[] = [];
  let current = ll.head;
  while (current) {
    result.push(current.value);
    current = current.next;
  }
  return result;
}

function createKnots(n: number) {
  const knots = new LinkedList<Knot>();
  for (let i = 0; i <= n; i++) {
    knots.append({ position: new Position(0, 0), visits: new Set<string>() });
  }
  return knots;
}

function parseData(data: string) {
  return data.split(/\n/).map((m) => {
    const [direction, steps] = m.split(" ");
    const position = {
      L: new Position(-1, 0),
      R: new Position(1, 0),
      U: new Position(0, 1),
      D: new Position(0, -1),
    }[direction];
    return [position, +steps] as [Position, number];
  });
}

//"final.txt"
readFile("./example.txt")
  .then((v) => solvePart2(v as string))
  .then(console.log);
