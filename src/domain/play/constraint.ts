import { PersistentArray, reverse, type Array } from "@/util/array";
import type { Square } from "./square";
import { repeat } from "@/util";


export interface Constraint
{
    value: number;
    satisfaction: Satisfaction;
};

export type Satisfaction = 'satisfied' | 'unsatisfied' | 'violated';

export class Constraints
{
    public readonly constraints: PersistentArray<Constraint>;

    public readonly satisfaction: Satisfaction;

    static fromArray(values: number[]): Constraints
    {
        const contents: PersistentArray<Constraint> = PersistentArray.fromArray(values.map(value => ({ value, satisfaction: 'unsatisfied' })));
        const satisfaction: Satisfaction = 'unsatisfied';

        return new Constraints(contents, satisfaction);
    }

    constructor(constraints: PersistentArray<Constraint>, satisfaction: Satisfaction)
    {
        this.constraints = constraints;
        this.satisfaction = satisfaction;
    }

    updateSatisfaction(squares: Array<Square>): Constraints
    {
        const { left, right, complete } = this.findIslands(squares);
        const updatedSatisfactions = repeat<Satisfaction>(this.constraints.length, 'unsatisfied')
        let updatedOverallSatisfaction: Satisfaction = 'unsatisfied';

        let i = 0;
        while ( i < left.length && i < this.constraints.length )
        {
            if ( left[i] === this.constraints.at(i).value )
            {
                updatedSatisfactions[i] = 'satisfied';
            }
            else
            {
                updatedSatisfactions[i] = 'violated';
                updatedOverallSatisfaction = 'violated';
            }

            ++i;
        }

        if ( updatedSatisfactions.every(s => s === 'satisfied' ) && squares.data.every(s => s.status !== 'unknown') )
        {
            updatedOverallSatisfaction = 'satisfied';
        }

        if ( complete && left.length !== this.constraints.length )
        {
            updatedOverallSatisfaction = 'violated';
        }

        let j = 0;
        while ( j < right.length && this.constraints.length - j > i )
        {
            if ( right[j] === this.constraints.at(this.constraints.length - j - 1).value )
            {
                updatedSatisfactions[this.constraints.length - j - 1] = 'satisfied';
            }
            else
            {
                updatedSatisfactions[this.constraints.length - j - 1] = 'violated';
                updatedOverallSatisfaction = 'violated';
            }

            j++;
        }

        const updatedConstraints = PersistentArray.create<Constraint>(this.constraints.length, i => ({value: this.constraints.at(i).value, satisfaction: updatedSatisfactions[i]}));
        return new Constraints(updatedConstraints, updatedOverallSatisfaction);
    }

    private findIslands(squares: Array<Square>): {left: number[], right: number[], complete: boolean}
    {
        const { islands: left, endReached } = this.findIslandsLeftToRight(squares);

        if ( endReached )
        {
            return { left, right: [], complete: true };
        }

        const { islands: right } = this.findIslandsLeftToRight(reverse(squares));

        return { left, right, complete: false };
    }

    private findIslandsLeftToRight(squares: Array<Square>): { islands: number[], endReached: boolean }
    {
        const islands: number[] = [];
        let i = 0;
        let filledCount = 0;

        while ( i < squares.length )
        {
            switch ( squares.at(i).status )
            {
                case 'filled':
                {
                    filledCount++;
                    i++;
                    break;
                }

                case 'empty':
                    if ( filledCount > 0 )
                    {
                        islands.push(filledCount);
                        filledCount = 0;
                    }
                    i++;
                    break;

                case 'unknown':
                    return { islands, endReached: false };

                default:
                    throw "bug";
            }
        }

        if ( filledCount > 0 )
        {
            islands.push(filledCount);
        }

        return { islands, endReached: true };
    }
}

export function createConstraintsList(...constraints: number[][]): PersistentArray<Constraints>
{
    return PersistentArray.fromArray(constraints.map(Constraints.fromArray));
}

