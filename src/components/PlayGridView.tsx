import { range } from "@/util";
import type { Grid } from "@/util/grid";
import classes from './PlayGridView.module.css'
import SquareView from "./SquareView";
import { Position } from "@/util/position";


interface Props
{
    grid: Grid<Square>;
}

export interface Square
{
    status: 'empty' | 'filled' | 'unknown';
}

export default function PlayGridView(props: Props): React.ReactNode
{
    const { grid } = props;

    return (
        <div className={classes.rows}>
            {range(0, grid.height).map(renderRow)}
        </div>
    );


    function renderRow(row: number): React.ReactNode
    {
        return (
            <div className={classes.row}>
                {range(0, grid.width).map(x => renderSquare(x, row))}
            </div>
        );
    }

    function renderSquare(x: number, y: number): React.ReactNode
    {
        const position = new Position(x, y);
        const square = grid.at(position);

        return (
            <SquareView status={square.status} />
        );
    }
}
