import { createSelectionIndexer, range } from "@/util";
import type { PersistentGrid } from "@/util/grid";
import { Position } from "@/util/position";
import { useState } from "react";
import classes from './PlayGridView.module.css';
import SquareView from "./SquareView";
import React from "react";


interface Props
{
    grid: PersistentGrid<SquareStatus>;
    onRangeSelected?: (startPosition: Position, endPosition: Position, mode: SquareStatus) => void;
}

export interface SquareStatus
{
    status: 'empty' | 'filled' | 'unknown';
}

export default function SquareGridView(props: Props): React.ReactNode
{
    const { grid } = props;
    const [ selectionStart, setSelectionStart ] = useState<Position | null>(null);
    const [ selectionEnd, setSelectionEnd ] = useState<Position | null>(null);
    const indexer = createIndexer();

    return (
        <div className={classes.rows}>
            {range(0, grid.height).map(renderRow)}
        </div>
    );


    function createIndexer(): (position: Position) => number | null
    {
        if ( selectionStart === null || selectionEnd === null )
        {
            return () => null;
        }

        // Only add caption if more than one square has been selected
        if ( selectionStart.x === selectionEnd.x && selectionStart.y === selectionEnd.y )
        {
            return () => null;
        }

        return createSelectionIndexer(selectionStart, selectionEnd);
    }

    function renderRow(row: number): React.ReactNode
    {
        return (
            <div className={classes.row} key={row}>
                {range(0, grid.width).map(x => renderSquare(x, row))}
            </div>
        );
    }

    function renderSquare(x: number, y: number): React.ReactNode
    {
        const position = new Position(x, y);
        const square = grid.at(position);
        const selectionIndex = indexer(position);
        const caption: string | undefined = selectionIndex === null ? undefined : `${selectionIndex + 1}`;

        return (
            <React.Fragment key={position.x}>
                <SquareView
                    status={square.status}
                    caption={caption}
                    onLeftPressed={() => onStartSelection(position) }
                    onLeftDragged={() => onUpdateSelection(position) }
                    onLeftReleased={(modifier: boolean) => onEndSelection(modifier ? 'unknown' : 'filled')}
                    onRightPressed={() => onStartSelection(position)}
                    onRightDragged={() => onUpdateSelection(position)}
                    onRightReleased={() => onEndSelection('empty')}
                    />
            </React.Fragment>
        );
    }

    function onStartSelection(position: Position): void
    {
        setSelectionStart(position);
        setSelectionEnd(position);
    }

    function onUpdateSelection(position: Position): void
    {
        setSelectionEnd(position);
    }

    function onEndSelection(mode: 'filled' | 'empty' | 'unknown'): void
    {
        if ( selectionStart !== null && selectionEnd !== null )
        {
            props.onRangeSelected?.(selectionStart, selectionEnd, mode);
        }

        setSelectionStart(null);
        setSelectionEnd(null);
    }
}
