export function range(start: number, stop: number): number[]
{
    const result = new Array(stop - start);

    for ( let i = 0; i !== result.length; ++i )
    {
        result[i] = start + i;
    }

    return result;
}