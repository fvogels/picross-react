import { Position } from "./position";

export class Grid<T>
{
    private grid: T[][];

    constructor(width: number, height: number, initializer: (p: Position) => T)
    {
        this.grid = new Array<T[]>(height);

        for ( let y = 0; y !== height; ++y )
        {
            this.grid[y] = new Array<T>(width);

            for ( let x = 0; x !== width; ++x )
            {
                const position = new Position(x, y);

                this.grid[y][x] = initializer(position);
            }
        }
    }

    get width(): number
    {
        return this.grid[0].length;
    }

    get height(): number
    {
        return this.grid.length;
    }

    at(position: Position): T
    {
        return this.grid[position.y][position.x];
    }
}