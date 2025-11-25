import type { List } from "@/util/list";
import type { Grid } from "@/util/grid";
import type { Position } from "@/util/position";
import React from "react";
import type { Constraints } from "./ConstraintsView";
import ConstraintsView from "./ConstraintsView";
import classes from './PuzzleView.module.css';
import SquareGridView from "./SquareGridView";


interface Props
{
    puzzle: Puzzle;
    onRangeSelected?: (startPosition: Position, endPosition: Position, mode: 'filled' | 'empty' | 'unknown') => void;
}

export interface Puzzle
{
    rowConstraints: List<Constraints>;
    columnConstraints: List<Constraints>;
    grid: Grid<string>;
}

export default function PuzzleView(props: Props): React.ReactNode
{
    return (
        <div className={classes.puzzleView}>
            <div className={classes.grid}>
                <SquareGridView grid={props.puzzle.grid} onRangeSelected={props.onRangeSelected} />
            </div>
            <div className={classes.rowConstraints}>
                {props.puzzle.rowConstraints.data.map(renderRowConstraints)}
            </div>
            <div className={classes.columnConstraints}>
                {props.puzzle.columnConstraints.data.map(renderColumnConstraints)}
            </div>
        </div>
    );


    function renderRowConstraints(constraints: Constraints, index: number): React.ReactNode
    {
        return (
            <React.Fragment key={index}>
                <ConstraintsView constraints={constraints} orientation="horizontal" />
            </React.Fragment>
        );
    }

    function renderColumnConstraints(constraints: Constraints, index: number): React.ReactNode
    {
        return (
            <React.Fragment key={index}>
                <ConstraintsView constraints={constraints} orientation="vertical" />
            </React.Fragment>
        );
    }
}
