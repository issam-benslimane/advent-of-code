export class Position {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  plus({ x, y }: Position) {
    return new Position(this.x + x, this.y + y);
  }

  minus({ x, y }: Position) {
    return new Position(this.x - x, this.y - y);
  }

  times({ x, y }: Position) {
    return new Position(this.x * x, this.y * y);
  }

  reverse() {
    return new Position(this.y, this.x);
  }

  abs() {
    return new Position(Math.abs(this.x), Math.abs(this.y));
  }
}
