import './App.css';
import EditorView from './components/EditorView';


export default function App(): React.ReactNode
{

    return (
        <>
            <EditorView width={5} height={5} />
        </>
    );


    // const puzzle = useMemo(createPuzzle, []);

    // return (
    //     <>
    //         <PlayablePuzzleView puzzle={puzzle} />
    //     </>
    // );
}

// function createPuzzle(): Puzzle
// {
//     const rowConstraints = createConstraintsList(
//         [1, 1],
//         [2],
//         [3],
//         [2],
//         [1],
//     );
//     const columnConstraints = createConstraintsList(
//         [1, 1],
//         [3, 1],
//         [3],
//         [2],
//         [1],
//     );

//     return Puzzle.create(rowConstraints, columnConstraints);
// }
