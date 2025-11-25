import { useMemo } from 'react';
import './App.css';
import EditorView from './screens/EditorScreen';
import PlayablePuzzleView from './screens/PlayScreen';
import { createConstraintsList } from './domain/play/constraint';
import { Puzzle } from './domain/play/puzzle';


export default function App(): React.ReactNode
{
    return editing();
    // return playing();


    function playing()
    {
        const puzzle = useMemo(createPuzzle, []);

        return (
            <>
                <PlayablePuzzleView puzzle={puzzle} />
            </>
        );
    }

    function editing()
    {
        return (
            <>
                <EditorView width={5} height={5} />
            </>
        );
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
