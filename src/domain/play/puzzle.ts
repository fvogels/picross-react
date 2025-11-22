import { PersistentGrid } from "@/util/grid";
import type { Square, SquareStatus } from "./square";
import type { PersistentArray } from "@/util/array";
import type { Constraints } from "./constraint";
import type { Position } from "@/util/position";


export class Puzzle
{
    public readonly grid: PersistentGrid<Square>;

    public readonly rowConstraints: PersistentArray<Constraints>;

    public readonly columnConstraints: PersistentArray<Constraints>;

    static create(rowConstraints: PersistentArray<Constraints>, columnConstraints: PersistentArray<Constraints>)
    {
        const width = columnConstraints.length;
        const height = rowConstraints.length;
        const square: Square = { status: 'unknown' };
        const grid = PersistentGrid.create<Square>(width, height, _ => square);

        return new Puzzle(grid, rowConstraints, columnConstraints);
    }

    private constructor(grid: PersistentGrid<Square>, rowConstraints: PersistentArray<Constraints>, columnConstraints: PersistentArray<Constraints>)
    {
        this.grid = grid;
        this.rowConstraints = rowConstraints;
        this.columnConstraints = columnConstraints;
    }

    update(position: Position, squareStatus: SquareStatus): Puzzle
    {
        const updatedGrid = this.grid.update(position, {status: squareStatus})
        const updatedRowConstraints = this.rowConstraints;
        const updatedColumnConstraints = this.columnConstraints;

        return new Puzzle(updatedGrid, updatedRowConstraints, updatedColumnConstraints);
    }
}