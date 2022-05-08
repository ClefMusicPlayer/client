class Queue<T> {
  private queue: T[] = [];
  private consumed: T[] = [];
  constructor() {}

  static from<K>(array: K[]) {
    const queue = new Queue<K>();
    queue.queue = array;
    return queue;
  }

  top(): T {
    return this.queue[0];
  }

  next(): T | undefined {
    const element = this.queue.shift();
    element && this.consumed.push(element);
    return element;
  }

  enqueue(value: T | T[]): Queue<T> {
    if (Array.isArray(value)) {
      this.queue.push(...value);
    } else this.queue.push(value);
    return this;
  }

  toArray(): T[] {
    return this.queue;
  }

  get length() {
    return this.queue.length;
  }

  *[Symbol.iterator]() {
    const queue = Queue.from(Array.from([...this.queue])); // Clone the array
    while (queue.length > 0) {
      yield queue.next();
    }
  }
}

export default Queue;
