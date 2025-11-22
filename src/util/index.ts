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
                console.log(`R2L ${p} ${start} ${end}`)
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