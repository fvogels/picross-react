import { Puzzle } from '@/domain/play/puzzle';
import classes from './IntroductionScreen.module.css';
import PlayScreen from './PlayScreen';
import { createConstraintsList } from '@/domain/play/constraint';
import EditorScreen from './EditorScreen';


interface Props
{
    setScreen: (screen: React.ReactNode) => void;
}

export default function IntroductionScreen(props: Props)
{
    return (
        <div className={classes.stack}>
            <button onClick={onPlay}>
                Play
            </button>
            <button onClick={onEdit}>
                Create Puzzle
            </button>
        </div>
    );


    function onPlay()
    {
        const screen = (
            <PlayScreen puzzle={createPuzzle()} />
        );

        props.setScreen(screen);
    }

    function onEdit()
    {
        const screen = (
            <EditorScreen width={10} height={10} />
        );

        props.setScreen(screen);
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
