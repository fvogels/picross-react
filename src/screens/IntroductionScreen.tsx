import { Button, Stack } from '@mantine/core';
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
    const sizes = [[5, 5], [10, 10], [15, 15]];

    return (
        <Stack>
            <button onClick={onPlay} className={classes.playButton}>
                Play
            </button>
            <div className={classes.header}>Create Puzzle</div>
            {renderCreatePuzzleButtons()}
            <div className={classes.header}>Solve Puzzle</div>
            {renderSolvePuzzleButtons()}
        </Stack>
    );


    function renderCreatePuzzleButtons(): React.ReactNode
    {
        return (
            <div className={classes.buttonContainer}>
                {
                    sizes.map(([w, h]) => {
                        return (
                            <button className={classes.sizeButton} onClick={() => onEdit(w, h)}>{w}&times;{h}</button>
                        );
                    })
                }
            </div>
        );
    }

    function renderSolvePuzzleButtons(): React.ReactNode
    {
        return (
            <div className={classes.buttonContainer}>
                {
                    sizes.map(([w, h]) => {
                        return (
                            <button className={classes.sizeButton} onClick={() => onSolve(w, h)}>{w}&times;{h}</button>
                        );
                    })
                }
            </div>
        );
    }

    function onPlay()
    {
        const screen = (
            <PlayLibraryScreen navigation={props.navigation} />
        );

        props.navigation.switchTo(screen);
    }

    function onEdit(width: number, height: number)
    {
        const screen = (
            <EditorScreen width={width} height={height} navigation={props.navigation} />
        );

        props.navigation.switchTo(screen);
    }

    function onSolve(width: number, height: number)
    {
        const screen = (
            <SolverScreen nagivation={props.navigation}  width={width} height={height} />
        )

        props.navigation.switchTo(screen);
    }
}
