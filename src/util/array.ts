import { range } from ".";


export abstract class Array<T>
{
    abstract get length(): number;

    abstract at(index: number): T;

    abstract get data(): T[];

    virtualMap<R>(transformer: (value: T, index: number) => R): Array<R>
    {
        return VirtualArray.create<R>(this.length, i => transformer(this.at(i), i));
    }
}

export class PersistentArray<T> extends Array<T>
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

    replace(index: number, newValue: T): PersistentArray<T>
    {
        const copy = [...this.items];
        copy[index] = newValue;
        return new PersistentArray<T>(copy);
    }

    update(index: number, transformer: (oldValue: T) => T): PersistentArray<T>
    {
        return this.replace(index, transformer(this.at(index)));
    }

    get data() : T[]
    {
        return this.items;
    }
}

export class VirtualArray<T> extends Array<T>
{
    public readonly length: number;

    private readonly valueFunction: (index: number) => T;

    static create<T>(length: number, valueFunction: (index: number) => T)
    {
        return new VirtualArray<T>(length, valueFunction);
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

export function reverse<T>(array: Array<T>): Array<T>
{
    return VirtualArray.create<T>(array.length, i => array.at(array.length - i - 1));
}
