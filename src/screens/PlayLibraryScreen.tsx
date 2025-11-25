import { library, type LibraryEntry } from "@/domain/play/library";
import type { Navigation } from "./navigation";
import classes from './PlayLibraryScreen.module.css';
import PlayScreen from "./PlayScreen";
import { Puzzle } from "@/domain/play/puzzle";
import { PersistentList } from "@/util/list";
import { Constraints } from "@/domain/play/constraint";


interface Props
{
    navigation: Navigation;
}

export default function PlayLibraryScreen(props: Props): React.ReactNode
{
    return (
        <div className={classes.library}>
            {library.map(renderPuzzle)}
        </div>
    );


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
            <PlayScreen puzzle={puzzle} />
        );

        props.navigation.switchTo(screen)
    }
}
