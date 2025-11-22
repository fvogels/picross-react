import { useState } from 'react';
import './App.css';
import PuzzleView from './components/PuzzleView';
import { createConstraintsList } from './domain/play/constraint';
import { Puzzle } from './domain/play/puzzle';
import { rangeSelection as positionsInRange } from './util';
import type { Position } from './util/position';


export default function App(): React.ReactNode
{
    const [puzzle, setPuzzle] = useState(createPuzzle());

    return (
        <>
            <PuzzleView puzzle={puzzle} />
        </>
    );


    function onRangeSelected(startPosition: Position, endPosition: Position, mode: 'filled' | 'empty' | 'unknown'): void
    {
        const selectedPositions = positionsInRange(startPosition, endPosition);
        let updatedPuzzle = puzzle;

        for ( const selectedPosition of selectedPositions )
        {
            updatedPuzzle = updatedPuzzle.update(selectedPosition, mode);
        }

        setPuzzle(updatedPuzzle);
    }
}

function createPuzzle(): Puzzle
{
    const rowConstraints = createConstraintsList(
        [1, 1],
        [2],
        [3],
        [2],
        [1],
    );
    const columnConstraints = createConstraintsList(
        [1, 1],
        [3, 1],
        [3],
        [2],
        [1],
    );

    return Puzzle.create(rowConstraints, columnConstraints);
}
