export interface Square
{
    get status(): SquareStatus;

    get ambiguous(): boolean;
}

export type SquareStatus = 'filled' | 'empty';
