import type { List } from "@/util/list";
import { Constraints } from "@/domain/constraints";
import { Grid, PersistentGrid } from "@/util/grid";
import { type SquareStatus } from "@/domain/square";
import { AmbiguityChecker } from "./ambiguity";
import { Position } from "@/util/position";


export interface Puzzle
{
    grid: Grid<SquareStatus>;
    rowConstraints: List<Constraints>;
    columnConstraints: List<Constraints>;
}

export function generate(width: number, height: number): Puzzle
{
    const generator = new PuzzleGenerator(width, height);
    generator.generate();
    const grid = generator.result;
    const { rowConstraints, columnConstraints } = Constraints.deriveAll(grid);
    return { grid, rowConstraints, columnConstraints };
}

class PuzzleGenerator
{
    readonly width: number;

    readonly height: number;

    private readonly grid: Grid<{status: SquareStatus}>;

    constructor(width: number, height: number)
    {
        this.width = width;
        this.height = height;
        this.grid = PersistentGrid.create(width, height, _ => ({status: 'empty'}));
    }

    generate(): void
    {
        const targetFilledSquaresCount = Math.ceil(this.width * this.height / 3);

        while ( this.countFilledSquares() < targetFilledSquaresCount )
        {
            this.addRandomGroup();
        }

        while ( !this.isSolvable() )
        {
            this.changeRandomSquare();
        }
    }

    get result(): Grid<SquareStatus>
    {
        return this.grid.virtualMap(s => s.status);
    }

    private countFilledSquares(): number
    {
        return this.grid.count(x => x.status === 'filled');
    }

    private changeRandomSquare(): void
    {
        const position = this.randomPosition();
        const square = this.grid.at(position);

        if ( square.status === 'filled' )
        {
            square.status = 'empty';
        }
        else
        {
            square.status = 'filled';
        }
    }

    private addRandomGroup(): void
    {
        const position = this.randomPosition();
        const length = this.randomLength();
        const [dx, dy] = this.randomDirection();

        let i = 0;
        while ( i < length )
        {
            const x = position.x + dx * i;
            const y = position.y + dy * i;
            const p = new Position(x, y);

            if ( !this.grid.isValidPosition(p) )
            {
                return;
            }

            this.grid.at(p).status = 'filled';
            i++;
        }
    }

    private randomDirection(): [number, number]
    {
        if ( Math.random() < 0.5 )
        {
            return [1, 0];
        }
        else
        {
            return [0, 1];
        }
    }

    private randomLength(): number
    {
        let result = 1;

        result += this.randomInteger(0, Math.floor(this.width / 4));
        result += this.randomInteger(0, Math.floor(this.width / 4));

        return result;
    }

    private isSolvable(): boolean
    {
        const { rowConstraints, columnConstraints } = Constraints.deriveAll(this.grid.virtualMap(s => s.status));
        const ambiguityChecker = new AmbiguityChecker(rowConstraints, columnConstraints);
        return ambiguityChecker.isSolveable();
    }

    private randomPosition(): Position
    {
        const x = this.randomInteger(0, this.width);
        const y = this.randomInteger(0, this.height);
        const position = new Position(x, y);

        if ( !this.grid.isValidPosition(position) )
        {
            console.error(position);
        }

        return position;
    }

    private randomInteger(lower: number, upper: number): number
    {
        return Math.floor(Math.random() * (upper - lower) + lower);
    }
}
