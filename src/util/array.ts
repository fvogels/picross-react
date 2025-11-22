import { range } from ".";


export interface IArray<T>
{
    get length(): number;

    at(index: number): T;

    get data(): T[];
}

export class PersistentArray<T> implements IArray<T>
{
    private readonly items: T[];

    static create<T>(size: number, initializer: (index: number) => T): PersistentArray<T>
    {
        const items = range(0, size).map(initializer);

        return new PersistentArray<T>(items);
    }

    static fromArray<T>(array: T[]): PersistentArray<T>
    {
        return new PersistentArray<T>([...array]);
    }

    private constructor(items: T[])
    {
        this.items = items;
    }

    get length(): number
    {
        return this.items.length;
    }

    at(index: number): T
    {
        return this.items[index];
    }

    update(index: number, newValue: T): PersistentArray<T>
    {
        const copy = [...this.items];
        copy[index] = newValue;
        return new PersistentArray<T>(copy);
    }

    get data() : T[]
    {
        return this.items;
    }
}

export class VirtualArray<T> implements IArray<T>
{
    public readonly length: number;

    private readonly valueFunction: (index: number) => T;

    static create<T>(length: number, valueFunction: (index: number) => T)
    {
        return new VirtualArray<T>(length, valueFunction);
    }

    private constructor(length: number, valueFunction: (index: number) => T)
    {
        this.length = length;
        this.valueFunction = valueFunction;
    }

    at(index: number): T
    {
        return this.valueFunction(index);
    }

    get data(): T[]
    {
        return range(0, this.length).map(this.valueFunction);
    }
}
