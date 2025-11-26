import type { List } from "@/util/list";
import type { Grid } from "@/util/grid";
import React from "react";
import type { Constraints } from "@/domain/constraints";
import classes from './SolverView.module.css';
import SquareGridView from "./SquareGridView";
import EditableConstraintsView from "./EditableConstraintsView";


interface Props
{
    rowConstraints: List<Constraints>;
    columnConstraints: List<Constraints>;
    grid: Grid<string>;

    onRowConstraintsUpdated?: (index: number, rowConstraints: Constraints) => void;
    onColumnConstraintsUpdated?: (index: number, rowConstraints: Constraints) => void;
}

export default function SolverView(props: Props): React.ReactNode
{
    return (
        <div className={classes.solverView}>
            <div className={classes.container}>
                <SquareGridView grid={props.grid} />
                <div className={classes.rowConstraints}>
                    {props.rowConstraints.data.map(renderRowConstraints)}
                </div>
                <div className={classes.columnConstraints}>
                    {props.columnConstraints.data.map(renderColumnConstraints)}
                </div>
            </div>
        </div>
    );


    function renderRowConstraints(constraints: Constraints, index: number): React.ReactNode
    {
        return (
            <React.Fragment key={index}>
                <EditableConstraintsView constraints={constraints} orientation="horizontal" onUpdate={c => props.onRowConstraintsUpdated?.(index, c)} />
            </React.Fragment>
        );
    }

    function renderColumnConstraints(constraints: Constraints, index: number): React.ReactNode
    {
        return (
            <React.Fragment key={index}>
                <EditableConstraintsView constraints={constraints} orientation="vertical" onUpdate={c => props.onColumnConstraintsUpdated?.(index, c)} />
            </React.Fragment>
        );
    }
}
