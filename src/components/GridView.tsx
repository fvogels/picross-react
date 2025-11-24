import { range } from "@/util";
import type { GridBase as Grid } from "@/util/grid";
import { Position } from "@/util/position";
import React from "react";
import classes from './PlayGridView.module.css';


interface Props
{
    grid: Grid<() => React.ReactNode>;
}

export default function GridView(props: Props): React.ReactNode
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
            <div className={classes.row} key={row}>
                {range(0, grid.width).map(x => renderCell(x, row))}
            </div>
        );
    }

    function renderCell(x: number, y: number): React.ReactNode
    {
        const position = new Position(x, y);

        return (
            <React.Fragment key={position.x}>
                {grid.at(position)()}
            </React.Fragment>
        );
    }
}
