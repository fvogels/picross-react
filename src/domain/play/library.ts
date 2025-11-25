export interface LibraryEntry
{
    rowConstraints: number[][];
    columnConstraints: number[][];
}

export const library: LibraryEntry[] = [
    {rowConstraints:[[5],[1,1],[1,1,1],[1,1],[5]],columnConstraints:[[5],[1,1],[1,1,1],[1,1],[5]]},
    {rowConstraints:[[1,1],[1,1,1],[1,1],[1,1],[1]],columnConstraints:[[2],[1,1],[1,1],[1,1],[2]]},
];
