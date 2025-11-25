import { Constraints as EditorConstraints, PuzzleEditor } from "@/domain/edit";
import { positionsInRange } from "@/util";
import type { Grid } from "@/util/grid";
import { PersistentList, type List } from "@/util/list";
import type { Position } from "@/util/position";
import React, { useState } from "react";
import type { Constraints as ViewConstraints } from "@/components/ConstraintsView";
import PuzzleView from "@/components/PuzzleView";
import classes from './EditorScreen.module.css';
import { AmbiguityChecker } from "@/domain/solve/ambiguity";
import { Constraints as AmbiguityConstraints } from "@/domain/solve/constraint";
import type { Navigation } from "./navigation";


interface Props
{
    navigation: Navigation;
    width: number;
    height: number;
}

export default function EditorScreen(props: Props): React.ReactNode
{
    const [ editor, setEditor ] = useState(PuzzleEditor.create(props.width, props.height));

    const rowConstraints: List<ViewConstraints> = editor.rowConstraints.virtualMap(translateToViewConstraints);
    const columnConstraints: List<ViewConstraints> = editor.columnConstraints.virtualMap(translateToViewConstraints);
    const ambiguityChecker = new AmbiguityChecker(editor.rowConstraints.virtualMap(translateToAmbiguityConstraints), editor.columnConstraints.virtualMap(translateToAmbiguityConstraints));
    const grid: Grid<string> = editor.grid.virtualMap((square, position) => {
        let classNames = [ classes[square] ];
        if ( ambiguityChecker.ambiguities.at(position) )
        {
            classNames.push(classes.ambiguous);
        }
        return classNames.join(' ');
    });
    const puzzle = { grid, rowConstraints, columnConstraints };

    return (
        <>
            <button className={classes.backButton} onClick={onBack}>Back</button>
            <div className={classes.stack}>
                <PuzzleView puzzle={puzzle} onRangeSelected={onRangeSelected} />
                <button onClick={copyConstraintsToClipboard}>To clipboard</button>
                <button onClick={resetGrid}>Reset</button>
            </div>
        </>
    );


    function onRangeSelected(startPosition: Position, endPosition: Position, mode: 'filled' | 'empty' | 'unknown'): void
    {
        const selectedPositions = positionsInRange(startPosition, endPosition);
        const fixedMode: 'filled' | 'empty' = mode === 'unknown' ? 'filled' : mode;
        let updatedEditor = editor;

        for ( const selectedPosition of selectedPositions )
        {
            updatedEditor = updatedEditor.replace(selectedPosition, fixedMode);
        }

        setEditor(updatedEditor);
    }


    function translateToViewConstraints(editorConstraints: EditorConstraints): ViewConstraints
    {
        return {
            constraints: PersistentList.create(editorConstraints.length, i => ({value: editorConstraints.at(i), satisfaction: 'satisfied'})),
            satisfaction: 'satisfied',
        };
    }

    function translateToAmbiguityConstraints(editorConstraints: EditorConstraints): AmbiguityConstraints
    {
        return AmbiguityConstraints.fromList(editorConstraints.asList());
    }

    function copyConstraintsToClipboard()
    {
        const rowConstraints = editor.rowConstraints.data.map(x => x.asList().data);
        const columnConstraints = editor.columnConstraints.data.map(x => x.asList().data);
        const json = JSON.stringify({rowConstraints, columnConstraints});
        navigator.clipboard.writeText(json);
    }

    function resetGrid()
    {
        setEditor(PuzzleEditor.create(props.width, props.height));
    }

    function onBack()
    {
        props.navigation.back();
    }
}
