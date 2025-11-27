import { range, repeat } from "@/util";
import type { Grid } from "@/util/grid";
import { PersistentList, type List } from "@/util/list";
import type { SquareStatus } from "./square";


export class Constraints
{
    readonly values: List<number>;

    static derive(squares: List<'filled' | 'empty'>)
    {
        const values: number[] = [];
        let count = 0;

        for ( let i = 0; i !== squares.length; ++i )
        {
            switch ( squares.at(i) )
            {
                case 'empty':
                    if ( count > 0 )
                    {
                        values.push(count);
                        count = 0;
                    }
                    break;

                case 'filled':
                    count += 1;
                    break;
            }
        }

        if ( count > 0 )
        {
            values.push(count);
        }

        return new Constraints(PersistentList.fromArray(values));
    }

    static deriveAll(grid: Grid<SquareStatus>): { rowConstraints: List<Constraints>, columnConstraints: List<Constraints> }
    {
        const columnConstraints = PersistentList.fromArray(range(0, grid.width).map(x => Constraints.derive(grid.column(x))));
        const rowConstraints = PersistentList.fromArray(range(0, grid.height).map(y => Constraints.derive(grid.row(y))));

        return { rowConstraints, columnConstraints };
    }

    static fromArray(values: number[])
    {
        return Constraints.fromList(PersistentList.fromArray(values));
    }

    static fromArrays(values: number[][]): List<Constraints>
    {
        return PersistentList.create<Constraints>(values.length, i => Constraints.fromArray(values[i]));
    }

    static fromList(values: List<number>)
    {
        return new Constraints(values);
    }

    private constructor(values: List<number>)
    {
        this.values = values;
    }

    equalTo(other: Constraints): boolean
    {
        return this.values.equalTo(other.values, (x, y) => x === y);
    }

    asString(): string
    {
        return '[' + this.values.data.map(x => `${x}`).join(",") + ']';
    }

    replace(index: number, value: number): Constraints
    {
        return Constraints.fromList(this.values.replace(index, value));
    }

    update(index: number, transformer: (value: number) => number): Constraints
    {
        return this.replace(index, transformer(this.values.at(index)));
    }

    insert(index: number, value: number): Constraints
    {
        return Constraints.fromList(this.values.insert(index, value));
    }

    removeAt(index: number): Constraints
    {
        const values = [...this.values.data];
        values.splice(index, 1);
        return Constraints.fromArray(values);
    }

    refine(squares: List<SquareStatus | 'unknown'>): (SquareStatus | 'unknown')[]
    {
        let result: (SquareStatus | 'unknown')[] = [];
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

        if ( isFirst )
        {
            throw "no solutions!";
        }

        return result;
    }

    private generateCompatible(compatibleWith: List<SquareStatus | 'unknown'>): Iterable<('filled' | 'empty')[]>
    {
        const squares = compatibleWith.data;
        const constraints = this.values.data;
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
