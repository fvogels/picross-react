import { Puzzle } from '@/domain/play/puzzle';
import { generateRandomPuzzle } from '@/domain/solve/generator';
import { Button, Group, Slider, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import EditorScreen from './EditorScreen';
import type { Navigation } from './navigation';
import PlayScreen from './PlayScreen';
import SolverScreen from './SolverScreen';


interface Props
{
    navigation: Navigation;
}

export default function IntroductionScreen(props: Props)
{
    const [ puzzleWidth, setPuzzleWidth ] = useState<number>(5);
    const [ puzzleHeight, setPuzzleHeight ] = useState<number>(5);


    return (
        <Stack>
            <Stack m='xl'>
                {renderSizeSlider("Width", puzzleWidth, setPuzzleWidth)}
                {renderSizeSlider("Height", puzzleHeight, setPuzzleHeight)}
            </Stack>
            <Group justify='space-between' w='100%' mt='xl'>
                <Button size='xl' onClick={onPlay}>
                    Play
                </Button>
                <Button size='xl' onClick={onEdit}>
                    Edit
                </Button>
                <Button size='xl' onClick={onSolve}>
                    Solve
                </Button>
            </Group>
        </Stack>
    );


    function renderSizeSlider(caption: string, size: number, setter: (newValue: number) => void): React.ReactNode
    {
        const marks = [5, 10, 15].map(n => ({value: n, label: <>{n}</>}));

        return (
            <Stack m='md'>
                <Text>{caption}</Text>
                <Slider marks={marks} min={marks[0].value} max={marks[marks.length-1].value} value={size} labelAlwaysOn onChange={setter} />
            </Stack>
        );
    }

    function onPlay()
    {
        const { rowConstraints, columnConstraints } = generateRandomPuzzle(puzzleWidth, puzzleHeight);
        const puzzle = Puzzle.create(rowConstraints, columnConstraints);

        const screen = (
            <PlayScreen puzzle={puzzle} navigation={props.navigation} />
        );

        props.navigation.switchTo(screen);

    }

    function onEdit()
    {
        const screen = (
            <EditorScreen width={puzzleWidth} height={puzzleHeight} navigation={props.navigation} />
        );

        props.navigation.switchTo(screen);
    }

    function onSolve()
    {
        const screen = (
            <SolverScreen nagivation={props.navigation}  width={puzzleWidth} height={puzzleHeight} />
        )

        props.navigation.switchTo(screen);
    }
}
