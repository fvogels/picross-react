import { PersistentArray, VirtualArray, type IArray } from "./array";
import { Position } from "./position";


export abstract class GridBase<T>
{
    abstract get width(): number;

    abstract get height(): number;

    abstract at(position: Position): T;

    row(y: number): IArray<T>
    {
        return VirtualArray.create<T>(this.width, x => this.at(new Position(x, y)));
    }

    column(x: number): IArray<T>
    {
        return VirtualArray.create<T>(this.height, y => this.at(new Position(x, y)));
    }
}

export class PersistentGrid<T> extends GridBase<T>
{
    private grid: PersistentArray<PersistentArray<T>>;

    static create<T>(width: number, height: number, initializer: (p: Position) => T): PersistentGrid<T>
    {
        const grid = PersistentArray.create<PersistentArray<T>>(height, y => PersistentArray.create<T>(width, x => initializer(new Position(x, y))));

        return new PersistentGrid<T>(grid);
    }

    private constructor(grid: PersistentArray<PersistentArray<T>>)
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
