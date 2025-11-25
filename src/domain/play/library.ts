export interface LibraryEntry
{
    rowConstraints: number[][];
    columnConstraints: number[][];
}

export const library: LibraryEntry[] = [
    {
        rowConstraints: [[5],[1,1],[1,1,1],[1,1],[5]],
        columnConstraints: [[5],[1,1],[1,1,1],[1,1],[5]]
    },
    {
        rowConstraints: [[1,1],[1,1,1],[1,1],[1,1],[1]],
        columnConstraints: [[2],[1,1],[1,1],[1,1],[2]]
    },
    {
        rowConstraints: [[3,2],[4],[4],[3],[1,1],[3,3],[1,4,1],[3,1],[7],[2,4]],
        columnConstraints: [[1,5],[1,1,1,3],[1,1,1,2],[1,1,1,1],[1,2],[1,2],[1,1,4],[1,1,1,1],[2,1,1],[2,4]],
    },
    {
        rowConstraints: [[2,2],[3,2],[4,4],[3,3],[4],[3],[2,1],[6],[6],[2,3]],
        columnConstraints: [[1,4],[3,4],[3,2],[3,3],[3],[1,3],[1,1,1],[4],[7],[6]],
    },
];
