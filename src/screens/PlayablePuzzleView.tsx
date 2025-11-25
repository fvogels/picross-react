import type { Puzzle as DomainPuzzle } from "@/domain/play/puzzle"
import { useState } from "react"
import PuzzleView from "../components/PuzzleView";
import { positionsInRange } from "@/util";
import type { Position } from "@/util/position";
import type { Puzzle as ViewPuzzle } from "../components/PuzzleView";
import classes from './PlayablePuzzleView.module.css';


interface Props
{
    puzzle: DomainPuzzle;
}

export default function PlayablePuzzleView(props: Props): React.ReactNode
{
    const [puzzle, setPuzzle] = useState(props.puzzle);

    return (
        <PuzzleView puzzle={translate(puzzle)} onRangeSelected={onRangeSelected} />
    )


    function onRangeSelected(startPosition: Position, endPosition: Position, mode: 'filled' | 'empty' | 'unknown'): void
    {
        const positions = positionsInRange(startPosition, endPosition);
        const updatedPuzzle = positions.reduce<DomainPuzzle>((puzzle: DomainPuzzle, position: Position) => puzzle.update(position, mode), puzzle);

        setPuzzle(updatedPuzzle);
    }

    function translate(puzzle: DomainPuzzle): ViewPuzzle
    {
        const rowConstraints = puzzle.rowConstraints;
        const columnConstraints = puzzle.columnConstraints;
        const grid = puzzle.grid.virtualMap(status => classes[status]);

        return { rowConstraints, columnConstraints, grid };
    }
}
