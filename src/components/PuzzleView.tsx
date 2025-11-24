import type { Array } from "@/util/array";
import type { PersistentGrid } from "@/util/grid";
import type { Constraints } from "./ConstraintsView";
import ConstraintsView from "./ConstraintsView";
import type { SquareStatus } from "./SquareGridView";
import SquareGridView from "./SquareGridView";
import classes from './PuzzleView.module.css';
import type { Position } from "@/util/position";
import React from "react";


interface Props
{
    puzzle: Puzzle;
    onRangeSelected?: (startPosition: Position, endPosition: Position, mode: 'filled' | 'empty' | 'unknown') => void;
}

export interface Puzzle
{
    rowConstraints: Array<Constraints>;
    columnConstraints: Array<Constraints>;
    grid: PersistentGrid<SquareStatus>;
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
