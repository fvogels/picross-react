import { List, type PersistentList } from "@/util/list";
import { PersistentGrid } from "@/util/grid";
import type { Position } from "@/util/position";
import { PlayConstraints } from "./constraint";
import type { SquareStatus } from "./square";
import type { Constraints } from "@/domain/constraints";


export class Puzzle
{
    public readonly grid: PersistentGrid<SquareStatus>;

    public readonly rowConstraints: PersistentList<PlayConstraints>;

    public readonly columnConstraints: PersistentList<PlayConstraints>;

    static create(rowConstraints: List<Constraints>, columnConstraints: List<Constraints>)
    {
        const width = columnConstraints.length;
        const height = rowConstraints.length;
        const square: SquareStatus = 'unknown';
        const grid = PersistentGrid.create<SquareStatus>(width, height, _ => square);
        const rowPlayConstraints = rowConstraints.virtualMap(Puzzle.translateToPlayConstraints).force();
        const columnPlayConstraints = columnConstraints.virtualMap(Puzzle.translateToPlayConstraints).force();

        return new Puzzle(grid, rowPlayConstraints, columnPlayConstraints);
    }

    private constructor(grid: PersistentGrid<SquareStatus>, rowConstraints: PersistentList<PlayConstraints>, columnConstraints: PersistentList<PlayConstraints>)
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

    private static translateToPlayConstraints(constraints: Constraints): PlayConstraints
    {
        return PlayConstraints.fromList(constraints.values);
    }
}
