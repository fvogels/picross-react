import { Constraints as EditorConstraints, PuzzleEditor } from "@/domain/edit";
import { positionsInRange } from "@/util";
import type { Grid } from "@/util/grid";
import { PersistentList, type List } from "@/util/list";
import type { Position } from "@/util/position";
import React, { useState } from "react";
import type { Constraints as ViewConstraints } from "./ConstraintsView";
import PuzzleView from "./PuzzleView";
import classes from './EditorView.module.css';


interface Props
{
    width: number;
    height: number;
}

export default function EditorView(props: Props): React.ReactNode
{
    const [ editor, setEditor ] = useState(PuzzleEditor.create(props.width, props.height));

    const grid: Grid<string> = editor.grid.virtualMap(x => classes[x]);
    const rowConstraints: List<ViewConstraints> = editor.rowConstraints.virtualMap(translateConstraints);
    const columnConstraints: List<ViewConstraints> = editor.columnConstraints.virtualMap(translateConstraints);
    const puzzle = { grid, rowConstraints, columnConstraints };

    return (
        <PuzzleView puzzle={puzzle} onRangeSelected={onRangeSelected} />
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


    function translateConstraints(editorConstraints: EditorConstraints): ViewConstraints
    {
        return {
            constraints: PersistentList.create(editorConstraints.length, i => ({value: editorConstraints.at(i), satisfaction: 'satisfied'})),
            satisfaction: 'satisfied',
        };
    }
}
