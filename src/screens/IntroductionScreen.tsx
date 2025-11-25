import EditorScreen from './EditorScreen';
import classes from './IntroductionScreen.module.css';
import type { Navigation } from './navigation';
import PlayLibraryScreen from './PlayLibraryScreen';


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
}
