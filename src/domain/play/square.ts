export interface Square
{
    status: SquareStatus;
}

export type SquareStatus = 'filled' | 'empty' | 'unknown';