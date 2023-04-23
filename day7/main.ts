import fs from "fs";
import EventEmitter from "events";

function readFile(filename = "example.txt") {
  return new Promise((res, rej) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) return rej(err);
      res(data);
    });
  });
}

function solvePart1(data: string) {
  const fs = parse(data);
  return fs.getDirectories().reduce((sum, dir) => {
    const size = dir.size;
    if (size > 100000) return sum;
    return sum + size;
  }, 0);
}

function solvePart2(data: string) {
  const fs = parse(data);
  const DISK_SIZE = 70000000;
  const UPDATE_SIZE = 30000000;
  const AVAILABLE_SIZE = DISK_SIZE - fs.size;
  let finalDir = fs.root;
  for (let dir of fs.getDirectories()) {
    let finalDirSize = finalDir.size,
      dirSize = dir.size;
    if (dirSize + AVAILABLE_SIZE < UPDATE_SIZE) continue;
    if (finalDirSize > dirSize) finalDir = dir;
  }
  return finalDir.size;
}

//"final.txt"
readFile("final.txt")
  .then((v) => solvePart2(v as string))
  .then(console.log);

function parse(lines: string) {
  let fs = new FileSystem();
  for (let line of lines.split(/\n/)) {
    if (isCommand(line)) {
      let [command, argument] = line.slice(2).split(/\s/);
      if (command === "ls") continue;
      fs.changeDir(argument);
    } else {
      const [arg1, arg2] = line.split(/\s/);
      if (arg1 === "dir") {
        fs.mkdir(arg2);
      } else {
        fs.touch(arg2, Number(arg1));
      }
    }
  }
  return fs;
}

function isCommand(input: string) {
  return input.startsWith("$");
}

class File {
  name: string;
  size: number;
  type: string;
  path: string;
  constructor(name: string, type: string, size: number, path: string) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.path = path;
  }
}

class Directory extends EventEmitter {
  name: string;
  path: string;
  _size: number;
  items: Array<File | Directory>;
  constructor(name: string, path: string = name) {
    super();
    this.name = name;
    this.path = path;
    this._size = 0;
    this.items = [];
  }

  insert(item: File | Directory) {
    if (item instanceof Directory)
      item.on("change", (size: number) => {
        this._size += size;
        this.emit("change", size);
      });
    else this.emit("change", item.size);
    this._size += item.size;
    this.items.push(item);
  }

  has(name: string) {
    return this.items.some((item) => item.name === name);
  }

  getItem(name: string) {
    const item = this.items.find((item) => item.name === name);
    if (!item) throw new Error("No such file or directory");
    return item;
  }

  get size(): number {
    return this._size;
  }
}

class FileSystem {
  root = new Directory("root", "");
  currentDir = this.root;

  mkdir(dirname: string) {
    const fullPath = `${this.currentDir.path}/${dirname}`;
    this.currentDir.insert(new Directory(dirname, fullPath));
  }

  touch(filename: string, size: number) {
    const fullPath = `${this.currentDir.path}/${filename}`;
    const [name, type] = filename.split(/\./);
    this.currentDir.insert(new File(name, type, size, fullPath));
  }

  changeDir(pattern: string) {
    if (pattern === "/") this.currentDir = this.root;
    else {
      let finalPath = this.currentDir.path
        .split("/")
        .filter((p) => p.trim() !== "");
      for (let path of pattern.split("/")) {
        if (path === ".") continue;
        else if (path === "..") {
          finalPath.splice(-1, 1);
        } else {
          finalPath.push(path);
        }
        this.currentDir = this.getDir(finalPath.join("/"));
      }
    }
  }

  getDir(path: string) {
    if (!path) return this.root;
    const queue = path.split("/");
    let currentDir = this.root;
    while (queue.length > 0) {
      const current = queue.shift() as string;
      currentDir = currentDir.getItem(current) as Directory;
    }
    return currentDir;
  }

  getDirectories(dir = this.root): Directory[] {
    return dir.items.reduce((result, item) => {
      if (item instanceof File) return result;
      return [...result, item, ...this.getDirectories(item)];
    }, [] as Directory[]);
  }

  get size() {
    return this.root.size;
  }
}
