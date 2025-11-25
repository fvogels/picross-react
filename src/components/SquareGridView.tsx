import { createSelectionIndexer } from "@/util";
import type { Grid } from "@/util/grid";
import { Position } from "@/util/position";
import React, { useMemo, useState } from "react";
import GridView from "./GridView";
import SquareView from "./SquareView";


interface Props
{
    grid: Grid<string>;

    onRangeSelected?: (startPosition: Position, endPosition: Position, mode: 'empty' | 'filled' | 'unknown') => void;
}

export default function SquareGridView(props: Props): React.ReactNode
{
    const { grid } = props;
    const [ selectionStart, setSelectionStart ] = useState<Position | null>(null);
    const [ selectionEnd, setSelectionEnd ] = useState<Position | null>(null);
    const rendererGrid = useMemo(() => grid.virtualMap(renderSquare), [grid, selectionStart, selectionEnd]);
    const indexer = createIndexer();

    return (
        <GridView grid={rendererGrid} />
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

    function renderSquare(className: string, position: Position): React.ReactNode
    {
        const selectionIndex = indexer(position);
        const caption: string | undefined = selectionIndex === null ? undefined : `${selectionIndex + 1}`;

        return (
            <React.Fragment key={position.x}>
                <SquareView
                    className={className}
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
