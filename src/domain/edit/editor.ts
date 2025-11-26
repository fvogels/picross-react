import { range } from "@/util";
import { List, PersistentList } from "@/util/list";
import { Grid, PersistentGrid } from "@/util/grid";
import type { Position } from "@/util/position";
import type { SquareStatus } from "./square";
import { Constraints } from "@/domain/constraints";


export class PuzzleEditor
{
    readonly grid: PersistentGrid<SquareStatus>;

    readonly rowConstraints: List<Constraints>;

    readonly columnConstraints: List<Constraints>;

    static create(width: number, height: number)
    {
        const grid = PersistentGrid.create<SquareStatus>(width, height, _ => 'empty');

        return new PuzzleEditor(grid);
    }

    private constructor(grid: PersistentGrid<SquareStatus>)
    {
        this.grid = grid;
        this.rowConstraints = PuzzleEditor.deriveRowConstraints(grid);
        this.columnConstraints = PuzzleEditor.deriveColumnConstraints(grid);
    }

    replace(position: Position, squareStatus: SquareStatus): PuzzleEditor
    {
        const updatedGrid = this.grid.replace(position, squareStatus);

        return new PuzzleEditor(updatedGrid);
    }

    private static deriveRowConstraints(grid: Grid<SquareStatus>): List<Constraints>
    {
        const items = range(0, grid.height).map(y => Constraints.derive(grid.row(y)));

        return PersistentList.fromArray(items);
    }

    private static deriveColumnConstraints(grid: Grid<SquareStatus>): List<Constraints>
    {
        const items = range(0, grid.width).map(x => Constraints.derive(grid.column(x)));

        return PersistentList.fromArray(items);
    }
}
