import SolverView from "@/components/SolverView";
import { Constraints } from "@/domain/constraints";
import { Grid, PersistentGrid } from "@/util/grid";
import { List, PersistentList } from "@/util/list";
import { useState } from "react";
import type { Navigation } from "./navigation";
import { Solver } from "@/domain/solve/solver";
import classes from './SolverScreen.module.css';


interface Props
{
    nagivation: Navigation;
    width: number;
    height: number;
}

export default function SolverScreen(props: Props): React.ReactNode
{
    const [columnConstraints, setColumnConstraints] = useState<List<Constraints>>(PersistentList.create(props.width, _ => Constraints.fromArray([])));
    const [rowConstraints, setRowConstraints] = useState<List<Constraints>>(PersistentList.create(props.height, _ => Constraints.fromArray([])));
    const [grid, setGrid] = useState<Grid<string>>(PersistentGrid.create(props.width, props.height, _ => 'empty'));

    return (
        <>
            <button className={classes.backButton} onClick={onBack}>Back</button>
            <SolverView grid={grid} columnConstraints={columnConstraints} rowConstraints={rowConstraints} onRowConstraintsUpdated={onRowConstraintsUpdated} onColumnConstraintsUpdated={onColumnConstraintsUpdated} />
            <button onClick={onSolve} className={classes.button}>Solve</button>
        </>
    );


    function onRowConstraintsUpdated(index: number, updatedRowConstraints: Constraints): void
    {
        setRowConstraints(rc => rc.replace(index, updatedRowConstraints));
    }

    function onColumnConstraintsUpdated(index: number, updatedColumnConstraints: Constraints): void
    {
        setColumnConstraints(rc => rc.replace(index, updatedColumnConstraints));
    }

    function onSolve(): void
    {
        const solver = new Solver(rowConstraints, columnConstraints);

        try
        {
            solver.solve();
            setGrid(solver.solution.virtualMap(s => classes[s]));
        }
        catch ( e )
        {
            setGrid(solver.solution.virtualMap(_ => classes.unknown))
        }
    }

    function onBack()
    {
        props.nagivation.back();
    }
}