import fs from "fs";

function readFile(filename = "example.txt") {
  return new Promise((res, rej) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) return rej(err);
      res(data);
    });
  });
}

function solvePart1(data: string) {
  let trees = data.split(/\n/).map((row) => row.split(""));
  let visible = new Set();
  function iterate(n = 0) {
    if (n === 4) return;
    for (let y = 0; y < trees.length; y++) {
      let max = -Infinity;
      for (let x = 0; x < trees[y].length; x++) {
        const { x: xr, y: yr } = rotateCoords({ x, y }, trees.length, n);
        let current = +trees[yr][xr];
        if (current > max) {
          visible.add(`${yr},${xr}`);
          max = current;
        }
      }
    }
    iterate(n + 1);
  }
  iterate();
  return visible.size;
}

function solvePart2(data: string) {
  let trees = data.split(/\n/).map((row) => row.split(""));
  let scores = Array.from({ length: trees.length }, () =>
    Array.from({ length: trees[0].length }, () => 0)
  );
  function iterate(n = 0) {
    if (n === 4) return;
    for (let y = 0; y < trees.length; y++) {
      for (let x = 0; x < trees[y].length; x++) {
        const { x: xr, y: yr } = rotateCoords({ x, y }, trees.length, n);
        let current = +trees[yr][xr];
        let score = 0;
        for (let xp = 0; xp < x; xp++) {
          const { x: xr, y: yr } = rotateCoords({ x: xp, y }, trees.length, n);
          if (+trees[yr][xr] >= current) score = 1;
          else score++;
        }
        scores[yr][xr] = (scores[yr][xr] || 1) * (score || 1);
      }
    }
    iterate(n + 1);
  }
  iterate();
  return scores
    .flat()
    .reduce((max, current) => Math.max(max, current), -Infinity);
}

function rotateCoords(
  { x, y }: { x: number; y: number },
  size: number,
  n: number
) {
  while (n > 0) {
    [x, y] = [y, size - 1 - x];
    n--;
  }
  return { x, y };
}

//"final.txt"
readFile("final.txt")
  .then((v) => solvePart2(v as string))
  .then(console.log);
