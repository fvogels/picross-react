import { Puzzle } from '@/domain/play/puzzle';
import classes from './IntroductionScreen.module.css';
import PlayScreen from './PlayScreen';
import { createConstraintsList } from '@/domain/play/constraint';
import EditorScreen from './EditorScreen';
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
            <PlayLibraryScreen navigation={props.navigation} />
        );

        props.navigation.switchTo(screen);
    }

    function onEdit()
    {
        const screen = (
            <EditorScreen width={10} height={10} />
        );

        props.navigation.switchTo(screen);
    }
}
