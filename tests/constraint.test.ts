import { Constraints, type Satisfaction } from '@/domain/play/constraint';
import type { SquareStatus } from '@/domain/solve/square';
import { PersistentList, type List } from '@/util/list';
import { expect, test } from 'vitest';


function parseRow(str: string): List<SquareStatus>
{
    const squares: SquareStatus[] = [...str].map(c => {
        switch ( c )
        {
            case 'X':
                return 'filled';
            case '.':
                return 'empty';
            case '?':
                return 'unknown';
            default:
                throw "bug";
        }
    });

    return PersistentList.fromArray(squares);
}

function parseSatisfaction(s: string): Satisfaction
{
    switch ( s )
    {
        case 'S':
            return 'satisfied';
        case 'U':
            return 'unsatisfied';
        case 'V':
            return 'violated';
        default:
            throw "bug";
    }
}

test.each([
    [ [1], '.', 'U', 'V' ],
    [ [1], 'X', 'S', 'S' ],
    [ [1], 'X.', 'S', 'S' ],
    [ [1,1], 'X.X', 'SS', 'S' ],
    [ [1], 'X?', 'U', 'U' ],
    [ [2], 'X?', 'U', 'U' ],
    [ [2,1], 'XX.X', 'SS', 'S' ],
    [ [2,1], 'XXXX', 'VU', 'V' ],
    [ [2,1], 'XX....X', 'SS', 'S' ],
    [ [2,1], '...XX....X', 'SS', 'S' ],
    [ [2,1,1], '...XX....X', 'SSU', 'V' ],
    [ [1], '?.X', 'S', 'U' ],
    [ [1], 'X.X.X', 'S', 'V' ],
    [ [], '....', '', 'S'],
    [ [1,2,1], '.......', 'UUU', 'V'],
    [ [1,2,1], 'X......', 'SUU', 'V'],
    [ [1,2,1], 'X.X....', 'SVU', 'V'],
    [ [1,2,1], 'X.XX...', 'SSU', 'V'],
    [ [1,2,1], 'X.XX..X', 'SSS', 'S'],
    [ [1,2,1], 'X.XX?.X', 'SUS', 'U'],
    [ [1,2,1], 'X?XX?.X', 'UUS', 'U'],
    [ [2], 'XX.??', 'S', 'U'],
    [ [1,1], 'X.???', 'SU', 'U'],
    [ [1,1], 'X..??', 'SU', 'U'],
])('"%s".updateConstraints(%j)', (constraintsArray, rowString, satisfactions, overallSatisfaction) => {
    const constraint = Constraints.fromArray(constraintsArray);
    const squares = parseRow(rowString);
    const updatedConstraint = constraint.updateSatisfaction(squares);

    if ( satisfactions.length !== updatedConstraint.constraints.length )
    {
        throw "bug";
    }

    for ( let i = 0; i !== satisfactions.length; ++i )
    {
        const expected = parseSatisfaction(satisfactions.charAt(i));
        expect(updatedConstraint.constraints.at(i).satisfaction, `i=${i}`).to.be.equal(expected);
    }

    expect(updatedConstraint.satisfaction).to.be.equal(parseSatisfaction(overallSatisfaction));
})