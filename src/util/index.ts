import { Position } from "./position";

export function range(start: number, stop: number): number[]
{
    const result = new Array(stop - start);

    for ( let i = 0; i !== result.length; ++i )
    {
        result[i] = start + i;
    }

    return result;
}

export function indexOf<T>(xs: T[], predicate: (t: T) => boolean): number | null
{
    for ( let i = 0; i !== xs.length; ++i )
    {
        if ( predicate(xs[i]) )
        {
            return i;
        }
    }

    return null;
}

export function rangeSelection(start: Position, end: Position): Position[]
{
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    const result: Position[] = [];

    if ( dx >= dy )
    {
        // Horizontal selection
        const y = start.y;
        const xStart = Math.min(start.x, end.x);
        const xEnd = Math.max(start.x, end.x);

        for ( let i = xStart; i <= xEnd; ++i )
        {
            result.push(new Position(i, y));
        }
    }
    else
    {
        // Vertical selection
        const x = start.x;
        const yStart = Math.min(start.y, end.y);
        const yEnd = Math.max(start.y, end.y);

        for ( let i = yStart; i <= yEnd; ++i )
        {
            result.push(new Position(x, i));
        }
    }

    return result;
}

export function createSelectionIndexer(start: Position, end: Position): (p: Position) => number | null
{
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    if ( dx >= dy )
    {
        // Horizontal selection
        if ( start.x <= end.x )
        {
            // Left to right
            return (p: Position) => {
                if ( p.y !== start.y || p.x < start.x || p.x > end.x )
                {
                    return null;
                }

                return p.x - start.x;
            };
        }
        else
        {
            // Right to left
            return (p: Position) => {
                if ( p.y !== start.y || p.x < end.x || p.x > start.x )
                {
                    return null;
                }

                return start.x - p.x;
            };
        }
    }
    else
    {
        // Vertical selection
        if ( start.y <= end.y )
        {
            // Top to bottom
            return (p: Position) => {
                if ( p.x !== start.x || p.y < start.y || p.y > end.y )
                {
                    return null;
                }

                return p.y - start.y;
            };
        }
        else
        {
            // Bottom to top
            return (p: Position) => {
                if ( p.x !== start.x || p.y < end.y || p.y > start.y )
                {
                    return null;
                }

                return start.y - p.y;
            };
        }
    }
}