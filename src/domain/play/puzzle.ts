import { type IArray, type PersistentArray } from "@/util/array";
import { PersistentGrid } from "@/util/grid";
import type { Position } from "@/util/position";
import type { Constraints } from "./constraint";
import type { Square, SquareStatus } from "./square";


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
        const updatedGrid = this.grid.replace(position, {status: squareStatus})
        const updatedRowConstraints = this.rowConstraints.update(position.y, c => c.updateSatisfaction(updatedGrid.row(position.y)));
        const updatedColumnConstraints = this.columnConstraints.update(position.x, c => c.updateSatisfaction(updatedGrid.column(position.x)));

        return new Puzzle(updatedGrid, updatedRowConstraints, updatedColumnConstraints);
    }
}