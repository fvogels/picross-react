import { Grid, PersistentGrid } from "@/util/grid";
import type { Constraints } from "./constraint";
import type { Square, SquareStatus } from "./square";
import type { List } from "@/util/list";


export class Solver
{
    private readonly rowConstraints: List<Constraints>;

    private readonly columnConstraints: List<Constraints>;

    private readonly grid: PersistentGrid<Square>;

    private orientation: 'vertical' | 'horizontal';

    private index: number;

    constructor(rowConstraints: List<Constraints>, columnConstraints: List<Constraints>)
    {
        this.rowConstraints = rowConstraints;
        this.columnConstraints = columnConstraints;
        this.grid = PersistentGrid.create<Square>(columnConstraints.length, rowConstraints.length, _ => ({ status: 'unknown' }));
        this.orientation = 'horizontal';
        this.index = 0;
    }

    /**
     * @returns True if a pass was finished, false otherwise.
     */
    step(): boolean
    {
        if ( this.orientation === 'horizontal' )
        {
            const row = this.grid.column(this.index);
            const constraints = this.columnConstraints.at(this.index);
            const updatedStatuses = constraints.refine(row.virtualMap(x => x.status));

            for ( let i = 0; i !== row.length; ++i )
            {
                row.at(i).status = updatedStatuses[i];
            }

            this.index++;
            if ( this.index === this.columnConstraints.length )
            {
                this.orientation = 'vertical';
                this.index = 0;
            }

            return false;
        }
        else
        {
            const column = this.grid.row(this.index);
            const constraints = this.rowConstraints.at(this.index);
            const updatedStatuses = constraints.refine(column.virtualMap(x => x.status));

            for ( let i = 0; i !== column.length; ++i )
            {
                column.at(i).status = updatedStatuses[i];
            }

            this.index++;
            if ( this.index === this.rowConstraints.length )
            {
                this.orientation = 'horizontal';
                this.index = 0;
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    finishPass()
    {
        while ( !this.step() );
    }

    get isSolved(): boolean
    {
        return this.grid.every(({status}) => status !== 'unknown');
    }

    get unknownCount(): number
    {
        return this.grid.count(({status}) => status === 'unknown');
    }

    solve(): boolean
    {
        let unknownCount = this.unknownCount;

        while ( unknownCount > 0 )
        {
            this.finishPass();

            let newUnknownCount = this.unknownCount;

            if ( unknownCount === newUnknownCount )
            {
                return false;
            }

            unknownCount = newUnknownCount;
        }

        return true;
    }

    get solution(): Grid<SquareStatus>
    {
        return this.grid.virtualMap(s => s.status);
    }
}
