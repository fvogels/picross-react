import type { Puzzle as DomainPuzzle } from "@/domain/play/puzzle"
import { useState } from "react"
import PuzzleView from "../components/PuzzleView";
import { positionsInRange } from "@/util";
import type { Position } from "@/util/position";
import type { Puzzle as ViewPuzzle } from "@/components/PuzzleView";
import classes from './PlayScreen.module.css';
import type { Navigation } from "./navigation";


interface Props
{
    navigation: Navigation;
    puzzle: DomainPuzzle;
}

export default function PlayablePuzzleView(props: Props): React.ReactNode
{
    const [puzzle, setPuzzle] = useState(props.puzzle);
    const isSolved = puzzle.isSolved();

    return (
        <>
            <button className={classes.backButton} onClick={onBack}>Back</button>
            <PuzzleView puzzle={translate(puzzle)} onRangeSelected={onRangeSelected} />
            {renderSolvedMessage()}
        </>
    );


    function renderSolvedMessage(): React.ReactNode
    {
        const classNames = [ classes.solvedMessage ];

        if ( isSolved )
        {
            classNames.push(classes.solved);
        }

        return (
            <div className={classNames.join(' ')}>Solved!</div>
        );
    }

    function onRangeSelected(startPosition: Position, endPosition: Position, mode: 'filled' | 'empty' | 'unknown'): void
    {
        if ( !isSolved )
        {
            const positions = positionsInRange(startPosition, endPosition);
            const updatedPuzzle = positions.reduce<DomainPuzzle>((puzzle: DomainPuzzle, position: Position) => puzzle.update(position, mode), puzzle);

            setPuzzle(updatedPuzzle);
        }
    }

    function translate(puzzle: DomainPuzzle): ViewPuzzle
    {
        const rowConstraints = puzzle.rowConstraints;
        const columnConstraints = puzzle.columnConstraints;
        const grid = puzzle.grid.virtualMap(status => classes[status]);

        return { rowConstraints, columnConstraints, grid };
    }

    function onBack()
    {
        props.navigation.back();
    }
}
