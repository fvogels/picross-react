import EditorScreen from './EditorScreen';
import classes from './IntroductionScreen.module.css';
import type { Navigation } from './navigation';
import PlayLibraryScreen from './PlayLibraryScreen';
import SolverScreen from './SolverScreen';


interface Props
{
    navigation: Navigation;
}

export default function IntroductionScreen(props: Props)
{
    return (
        <div className={classes.stack}>
            <button onClick={onPlay} className={classes.button}>
                Play
            </button>
            <button onClick={onEdit} className={classes.button}>
                Create Puzzle
            </button>
            <button onClick={onSolve} className={classes.button}>
                Solve Puzzle
            </button>
        </div>
    );


    function onPlay()
    {
        const screen = (
            <PlayLibraryScreen navigation={props.navigation} />
        );

        props.navigation.switchTo(screen);
    }

    function onEdit()
    {
        const screen = (
            <EditorScreen width={10} height={10} navigation={props.navigation} />
        );

        props.navigation.switchTo(screen);
    }

    function onSolve()
    {
        const screen = (
            <SolverScreen nagivation={props.navigation}  width={5} height={5} />
        )

        props.navigation.switchTo(screen);
    }
}
