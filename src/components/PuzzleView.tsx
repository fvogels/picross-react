import type { PersistentGrid } from "@/util/grid";
import type { PersistentArray } from "@/util/array";
import type { Constraints } from "./ConstraintsView";
import ConstraintsView from "./ConstraintsView";
import type { Square } from "./PlayGridView";
import PlayGridView from "./PlayGridView";
import classes from './PuzzleView.module.css';


interface Props
{
    puzzle: Puzzle;
}

export interface Puzzle
{
    rowConstraints: PersistentArray<Constraints>;
    columnConstraints: PersistentArray<Constraints>;
    grid: PersistentGrid<Square>;
}

export default function PuzzleView(props: Props): React.ReactNode
{
    return (
        <div className={classes.puzzleView}>
            <div className={classes.grid}>
                <PlayGridView grid={props.puzzle.grid} />
            </div>
            <div className={classes.rowConstraints}>
                {props.puzzle.rowConstraints.data.map(renderRowConstraints)}
            </div>
            <div className={classes.columnConstraints}>
                {props.puzzle.columnConstraints.data.map(renderColumnConstraints)}
            </div>
        </div>
    );


    function renderRowConstraints(constraints: Constraints): React.ReactNode
    {
        return (
            <ConstraintsView constraints={constraints} orientation="horizontal" />
        );
    }

    function renderColumnConstraints(constraints: Constraints): React.ReactNode
    {
        return (
            <ConstraintsView constraints={constraints} orientation="vertical" />
        );
    }
}
