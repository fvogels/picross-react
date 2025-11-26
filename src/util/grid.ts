import { range } from ".";
import { PersistentList, VirtualList, type List } from "./list";
import { Position } from "./position";


export abstract class Grid<T>
{
    abstract get width(): number;

    abstract get height(): number;

    abstract at(position: Position): T;

    row(y: number): List<T>
    {
        return VirtualList.create<T>(this.width, x => this.at(new Position(x, y)));
    }

    column(x: number): List<T>
    {
        return VirtualList.create<T>(this.height, y => this.at(new Position(x, y)));
    }

    virtualMap<R>(transformer: (item: T, position: Position) => R): VirtualGrid<R>
    {
        return VirtualGrid.create(this.width, this.height, p => transformer(this.at(p), p));
    }

    isValidPosition(position: Position): boolean
    {
        return 0 <= position.x && position.x < this.width && 0 <= position.y && position.y < this.height;
    }

    get positions(): Iterable<Position>
    {
        const width = this.width;
        const height = this.height;

        return aux();

        function *aux(): Iterable<Position>
        {
            for ( let y = 0; y !== height; ++y )
            {
                for ( let x = 0; x != width; ++x )
                {
                    yield new Position(x, y);
                }
            }
        }
    }

    every(predicate: (item: T, position: Position) => boolean): boolean
    {
        for ( const position of this.positions )
        {
            const item = this.at(position);

            if ( !predicate(item, position) )
            {
                return false;
            }
        }

        return true;
    }

    count(predicate: (item: T, position: Position) => boolean): number
    {
        let result = 0;

        for ( const position of this.positions )
        {
            const item = this.at(position);

            if ( predicate(item, position) )
            {
                result++;
            }
        }

        return result;
    }

    toArrays(): T[][]
    {
        return range(0, this.height).map(y => range(0, this.width).map(x => this.at(new Position(x, y))));
    }
}

export class PersistentGrid<T> extends Grid<T>
{
    private grid: PersistentList<PersistentList<T>>;

    static create<T>(width: number, height: number, initializer: (p: Position) => T): PersistentGrid<T>
    {
        const grid = PersistentList.create<PersistentList<T>>(height, y => PersistentList.create<T>(width, x => initializer(new Position(x, y))));

        return new PersistentGrid<T>(grid);
    }

    private constructor(grid: PersistentList<PersistentList<T>>)
    {
        super();
        this.grid = grid;
    }

    get width(): number
    {
        return this.grid.at(0).length;
    }

    get height(): number
    {
        return this.grid.length;
    }

    at(position: Position): T
    {
        return this.grid.at(position.y).at(position.x);
    }

    replace(position: Position, newValue: T): PersistentGrid<T>
    {
        const row = this.grid.at(position.y);
        const updatedRow = row.replace(position.x, newValue);
        const updatedGrid = this.grid.replace(position.y, updatedRow);

        return new PersistentGrid<T>(updatedGrid);
    }
}


export class VirtualGrid<T> extends Grid<T>
{
    readonly width: number;

    readonly height: number;

    readonly at: (position: Position) => T;

    static create<T>(width: number, height: number, elementFetcher: (position: Position) => T): VirtualGrid<T>
    {
        return new VirtualGrid<T>(width, height, elementFetcher);
    }

    private constructor(width: number, height: number, elementFetcher: (position: Position) => T)
    {
        super();
        this.width = width;
        this.height = height;
        this.at = elementFetcher;
    }
}
