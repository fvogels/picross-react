import { Constraints } from '@/domain/solve/constraint';
import type { Square } from '@/domain/solve/square';
import { PersistentArray, type IArray } from '@/util/array';
import { expect, test } from 'vitest';


function parseSquares(str: string): IArray<Square>
{
    const squares: Square[] = [...str].map(c => {
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

    return PersistentArray.fromArray(squares);
}

function unparseSquares(squares: Square[]): string
{
    return squares.map(square => {
        switch ( square )
        {
            case 'empty':
                return '.';
            case 'filled':
                return 'X';
            case 'unknown':
                return '?';
        }
    }).join('');
}

test.each([
    [ [1], '?', 'X' ],
    [ [1], '??', '??' ],
    [ [2], '??', 'XX' ],
    [ [2], '???', '?X?' ],
    [ [2, 1], '????', 'XX.X' ],
    [ [1, 2], '????', 'X.XX' ],
    [ [3], '????', '?XX?' ],
    [ [4], '????', 'XXXX' ],
    [ [2,2], '?????', 'XX.XX' ],
    [ [2,1], '?????', '?X???' ],
    [ [1,1,1], '?????', 'X.X.X' ],
])('"%j".refine(%j)', (constraintsArray, rowString, expectedString) => {
    const constraints = Constraints.fromArray(constraintsArray);
    const squares = parseSquares(rowString);
    const expected = parseSquares(expectedString).data;
    const actual = constraints.refine(squares).data;

    expect(unparseSquares(actual)).to.be.equal(unparseSquares(expected));
})

test('x', () => {
    const constraints = Constraints.fromArray([1]);
    const squares = parseSquares('?');
    const actual = [...constraints.generateCompatible(squares)].map(unparseSquares);

    expect(actual.length).to.be.equal(1);
    expect(actual).contain('X')
})

test('x2', () => {
    const constraints = Constraints.fromArray([]);
    const squares = parseSquares('?');
    const actual = [...constraints.generateCompatible(squares)].map(unparseSquares);

    expect(actual.length).to.be.equal(1);
    expect(actual).contain('.');
})

test('x3', () => {
    const constraints = Constraints.fromArray([]);
    const squares = parseSquares('??');
    const actual = [...constraints.generateCompatible(squares)].map(unparseSquares);

    expect(actual.length).to.be.equal(1);
    expect(actual).contain('..');
})

test('x4', () => {
    const constraints = Constraints.fromArray([1]);
    const squares = parseSquares('??');
    const actual = [...constraints.generateCompatible(squares).map(unparseSquares)];

    expect(actual.length).to.be.equal(2);
    expect(actual).contain('X.');
    expect(actual).contain('.X');
})