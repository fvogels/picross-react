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
}