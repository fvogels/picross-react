import { useState } from 'react';
import './App.css'
import type { Square } from './components/PlayGridView';
import PlayGridView from './components/PlayGridView';
import { PersistentGrid } from './util/grid';
import type { Position } from './util/position';
import { rangeSelection as positionsInRange } from './util';


function App(): React.ReactNode
{
    const [grid, setGrid] = useState<PersistentGrid<Square>>(PersistentGrid.create<Square>(5, 5, (p: Position) => ({ status: 'unknown' })));

    return (
        <>
            <PlayGridView grid={grid} onRangeSelected={onRangeSelected} />
        </>
    );


    function onRangeSelected(startPosition: Position, endPosition: Position, mode: 'filled' | 'empty' | 'unknown'): void
    {
        const selectedPositions = positionsInRange(startPosition, endPosition);
        let updatedGrid = grid;

        for ( const selectedPosition of selectedPositions )
        {
            updatedGrid = updatedGrid.update(selectedPosition, { status: mode });
        }

        setGrid(updatedGrid);
    }
}

export default App;
