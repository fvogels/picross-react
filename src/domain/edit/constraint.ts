import { PersistentList, type List } from "@/util/list";
import type { SquareStatus } from "./square";


export class Constraints
{
    private readonly values: List<number>;

    static derive(squares: List<SquareStatus>)
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

    private constructor(values: List<number>)
    {
        this.values = values;
    }

    get length(): number
    {
        return this.values.length;
    }

    at(index: number): number
    {
        return this.values.at(index);
    }

    asList(): List<number>
    {
        return this.values;
    }

    asString(): string
    {
        return '[' + this.values.data.map(x => `${x}`).join(",") + ']';
    }
}
