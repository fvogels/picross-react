import { library, type LibraryEntry } from "@/domain/play/library";
import type { Navigation } from "./navigation";
import classes from './PlayLibraryScreen.module.css';
import PlayScreen from "./PlayScreen";
import { Puzzle } from "@/domain/play/puzzle";
import { PersistentList } from "@/util/list";
import { Constraints } from "@/domain/play/constraint";
import { useMemo } from "react";


interface Props
{
    navigation: Navigation;
}

export default function PlayLibraryScreen(props: Props): React.ReactNode
{
    const puzzleSizes = useMemo(() => determinePuzzleSizes(library), []);

    return (
        <>
            <button className={classes.backButton} onClick={onBack}>Back</button>
            <div className={classes.library}>
                {puzzleSizes.map(renderPuzzlesWithSize)}
            </div>
        </>
    );


    function renderPuzzlesWithSize([width, height]: [number, number]): React.ReactNode
    {
        const puzzles = library.filter(entry => entry.columnConstraints.length === width && entry.rowConstraints.length === height);

        return (
            <div className={classes.librarySection}>
                <span className={classes.libraryHeader}>{width} &times; {height}</span>
                <div className={classes.librarySectionEntries}>
                    {puzzles.map(renderPuzzle)}
                </div>
            </div>
        );
    }

    function renderPuzzle(libraryEntry: LibraryEntry, index: number): React.ReactNode
    {
        const width = libraryEntry.columnConstraints.length;
        const height = libraryEntry.rowConstraints.length;

        return (
            <div className={classes.libraryEntry} onClick={() => startPuzzle(libraryEntry)} key={index}>
                {width} &times; {height}
            </div>
        )
    }

    function startPuzzle(libraryEntry: LibraryEntry): void
    {
        const rowConstraints: PersistentList<Constraints> = PersistentList.fromArray(libraryEntry.rowConstraints.map(Constraints.fromArray));
        const columnConstraints: PersistentList<Constraints> = PersistentList.fromArray(libraryEntry.columnConstraints.map(Constraints.fromArray));
        const puzzle = Puzzle.create(rowConstraints, columnConstraints);

        const screen = (
            <PlayScreen puzzle={puzzle} navigation={props.navigation} />
        );

        props.navigation.switchTo(screen)
    }

    function onBack()
    {
        props.navigation.back();
    }

    function determinePuzzleSizes(libraryEntries: LibraryEntry[]): [number, number][]
    {
        const set = new Set<string>();

        for ( const libraryEntry of libraryEntries )
        {
            const width = libraryEntry.columnConstraints.length;
            const height = libraryEntry.rowConstraints.length;

            set.add(`${width}x${height}`);
        }

        return [...set].map(s => {
            const [w, h] = s.split('x');
            return [parseInt(w), parseInt(h)];
        });
    }
}
