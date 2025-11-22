import type { Puzzle } from "@/domain/play/puzzle"
import { useState } from "react"
import PuzzleView from "./PuzzleView";
import { positionsInRange } from "@/util";
import type { Position } from "@/util/position";


interface Props
{
    puzzle: Puzzle;
}

export default function PlayablePuzzleView(props: Props): React.ReactNode
{
    const [puzzle, setPuzzle] = useState(props.puzzle);

    return (
        <PuzzleView puzzle={puzzle} onRangeSelected={onRangeSelected} />
    )


    function onRangeSelected(startPosition: Position, endPosition: Position, mode: 'filled' | 'empty' | 'unknown'): void
    {
        const positions = positionsInRange(startPosition, endPosition);
        const updatedPuzzle = positions.reduce<Puzzle>((puzzle: Puzzle, position: Position) => puzzle.update(position, mode), puzzle);

        setPuzzle(updatedPuzzle);
    }
}