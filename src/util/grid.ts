import { PersistentArray } from "./parray";
import { Position } from "./position";


export class PersistentGrid<T>
{
    private grid: PersistentArray<PersistentArray<T>>;

    static create<T>(width: number, height: number, initializer: (p: Position) => T): PersistentGrid<T>
    {
        const grid = PersistentArray.create<PersistentArray<T>>(height, y => PersistentArray.create<T>(width, x => initializer(new Position(x, y))));

        return new PersistentGrid<T>(grid);
    }

    private constructor(grid: PersistentArray<PersistentArray<T>>)
    {
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

    update(position: Position, newValue: T): PersistentGrid<T>
    {
        const row = this.grid.at(position.y);
        const updatedRow = row.update(position.x, newValue);
        const updatedGrid = this.grid.update(position.y, updatedRow);

        return new PersistentGrid<T>(updatedGrid);
    }
}
