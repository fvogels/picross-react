import { range } from ".";


export abstract class List<T>
{
    abstract get length(): number;

    abstract at(index: number): T;

    abstract get data(): T[];

    virtualMap<R>(transformer: (value: T, index: number) => R): List<R>
    {
        return VirtualList.create<R>(this.length, i => transformer(this.at(i), i));
    }
}

export class PersistentList<T> extends List<T>
{
    private readonly items: T[];

    static create<T>(size: number, initializer: (index: number) => T): PersistentList<T>
    {
        const items = range(0, size).map(initializer);

        return new PersistentList<T>(items);
    }

    static fromArray<T>(array: T[]): PersistentList<T>
    {
        return new PersistentList<T>([...array]);
    }

    private constructor(items: T[])
    {
        super();
        this.items = items;
    }

    get length(): number
    {
        return this.items.length;
    }

    at(index: number): T
    {
        if ( index < 0 || index >= this.length )
        {
            throw new Error(`index out of bounds: ${index} (len=${this.length})`);
        }

        return this.items[index];
    }

    replace(index: number, newValue: T): PersistentList<T>
    {
        const copy = [...this.items];
        copy[index] = newValue;
        return new PersistentList<T>(copy);
    }

    update(index: number, transformer: (oldValue: T) => T): PersistentList<T>
    {
        return this.replace(index, transformer(this.at(index)));
    }

    get data() : T[]
    {
        return this.items;
    }
}

export class VirtualList<T> extends List<T>
{
    public readonly length: number;

    private readonly valueFunction: (index: number) => T;

    static create<T>(length: number, valueFunction: (index: number) => T)
    {
        return new VirtualList<T>(length, valueFunction);
    }

    private constructor(length: number, valueFunction: (index: number) => T)
    {
        super();
        this.length = length;
        this.valueFunction = valueFunction;
    }

    at(index: number): T
    {
        if ( index < 0 || index >= this.length )
        {
            throw new Error(`index out of bounds: ${index}`);
        }

        return this.valueFunction(index);
    }

    get data(): T[]
    {
        return range(0, this.length).map(this.valueFunction);
    }
}

export function reverse<T>(array: List<T>): List<T>
{
    return VirtualList.create<T>(array.length, i => array.at(array.length - i - 1));
}

export class RangeList extends List<number>
{
    private readonly start;

    readonly length;

    static create(start: number, length: number)
    {
        return new RangeList(start, length);
    }

    private constructor(start: number, length: number)
    {
        super();

        this.start = start;
        this.length = length;
    }

    at(index: number): number
    {
        return this.start + index;
    }

    get data(): number[]
    {
        return range(this.start, this.start + this.length);
    }
}
