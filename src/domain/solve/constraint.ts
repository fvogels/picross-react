import { repeat } from "@/util";
import { PersistentArray, type Array } from "@/util/array";
import type { SquareStatus } from "./square";


export class Constraints
{
    private readonly values: number[];

    static fromArray(values: number[])
    {
        return new Constraints([...values]);
    }

    private constructor(values: number[])
    {
        this.values = values;
    }

    refine(squares: Array<SquareStatus>): Array<SquareStatus>
    {
        let result: SquareStatus[] = [];
        let isFirst = true;

        for ( const candidate of this.generateCompatible(squares) )
        {
            if ( isFirst )
            {
                result = [...candidate];
                isFirst = false;
            }
            else
            {
                for ( let i = 0; i !== result.length; ++i )
                {
                    if ( result[i] !== candidate[i] )
                    {
                        result[i] = 'unknown';
                    }
                }
            }
        }

        return PersistentArray.fromArray(result);
    }

    private generateCompatible(compatibleWith: Array<SquareStatus>): Iterable<('filled' | 'empty')[]>
    {
        const squares = compatibleWith.data;
        const constraints = this.values;
        const array = repeat<'filled' | 'empty'>(squares.length, 'empty');

        return helper(0, 0);


        function *helper(constraintIndex: number, squareIndex: number): Iterable<('filled' | 'empty')[]>
        {
            // Check if we reached the end of the squares array
            if ( squareIndex === array.length )
            {
                // The current squares array is valid only if there are no constraints left
                if ( constraintIndex === constraints.length )
                {
                    yield array;
                }
            }
            else if ( constraintIndex === constraints.length )
            {
                // We are out of constraints
                // All remaining squares must be empty

                if ( squares[squareIndex] !== 'filled' )
                {
                    array[squareIndex] = 'empty';
                    yield* helper(constraintIndex, squareIndex + 1);
                }
            }
            else
            {
                // In this branch, there are constraints left and squares still to be determined

                // Try to add an empty square
                if ( squares[squareIndex] !== 'filled' )
                {
                    array[squareIndex] = 'empty';
                    yield* helper(constraintIndex, squareIndex + 1);
                }

                // Try to add a group of filled squares
                const groupSize = constraints[constraintIndex];
                if ( squareIndex + groupSize <= squares.length )
                {
                    let okay = true;

                    for ( let i = 0; i !== groupSize; ++i )
                    {
                        if ( squares[squareIndex + i] !== 'empty' )
                        {
                            array[squareIndex + i] = 'filled';
                        }
                        else
                        {
                            okay = false;
                            break;
                        }
                    }

                    if ( okay )
                    {
                        if ( squareIndex + groupSize === squares.length )
                        {
                            // We reached the end, no extra empty square necessary
                            yield* helper(constraintIndex + 1, squareIndex + groupSize);
                        }
                        else
                        {
                            // Extra empty square is required
                            if ( squares[squareIndex + groupSize] !== 'filled' )
                            {
                                array[squareIndex + groupSize] = 'empty';
                                yield* helper(constraintIndex + 1, squareIndex + groupSize + 1);
                            }
                        }
                    }
                }
            }
        }
    }
}
