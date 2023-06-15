export type Node<T> = {
  value: T;
  next?: Node<T>;
};

export class LinkedList<T> {
  length: number;
  head?: Node<T>;
  tail?: Node<T>;
  constructor() {
    this.length = 0;
  }

  append(value: T) {
    let newNode: Node<T> = { value };
    this.length++;
    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    this.tail.next = newNode;
    this.tail = newNode;
  }

  set(index: number, value: T) {
    if (this.length < index) return;
    let currentNode = this.head;
    let currentIndex = 0;
    while (currentIndex < index) {
      currentNode = currentNode?.next;
      currentIndex++;
    }
    (currentNode as Node<T>).value = value;
  }
}
