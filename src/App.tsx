import { useMemo } from 'react';
import './App.css';
import PlayablePuzzleView from './components/PlayablePuzzleView';
import { createConstraintsList } from './domain/play/constraint';
import { Puzzle } from './domain/play/puzzle';


export default function App(): React.ReactNode
{
    const puzzle = useMemo(createPuzzle, []);

    return (
        <>
            <PlayablePuzzleView puzzle={puzzle} />
        </>
    );
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
