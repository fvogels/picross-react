import { type PersistentList } from "@/util/list";
import { PersistentGrid } from "@/util/grid";
import type { Position } from "@/util/position";
import type { Constraints } from "./constraint";
import type { SquareStatus } from "./square";


export class Puzzle
{
    public readonly grid: PersistentGrid<SquareStatus>;

    public readonly rowConstraints: PersistentList<Constraints>;

    public readonly columnConstraints: PersistentList<Constraints>;

    static create(rowConstraints: PersistentList<Constraints>, columnConstraints: PersistentList<Constraints>)
    {
        const width = columnConstraints.length;
        const height = rowConstraints.length;
        const square: SquareStatus = 'unknown';
        const grid = PersistentGrid.create<SquareStatus>(width, height, _ => square);

        return new Puzzle(grid, rowConstraints, columnConstraints);
    }

    private constructor(grid: PersistentGrid<SquareStatus>, rowConstraints: PersistentList<Constraints>, columnConstraints: PersistentList<Constraints>)
    {
        this.grid = grid;
        this.rowConstraints = rowConstraints;
        this.columnConstraints = columnConstraints;
    }

    update(position: Position, squareStatus: SquareStatus): Puzzle
    {
        const updatedGrid = this.grid.replace(position, squareStatus)
        const updatedRowConstraints = this.rowConstraints.update(position.y, c => c.updateSatisfaction(updatedGrid.row(position.y)));
        const updatedColumnConstraints = this.columnConstraints.update(position.x, c => c.updateSatisfaction(updatedGrid.column(position.x)));

        return new Puzzle(updatedGrid, updatedRowConstraints, updatedColumnConstraints);
    }
}