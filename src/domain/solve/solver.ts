import { PersistentGrid } from "@/util/grid";
import type { Constraints } from "./constraint";
import type { Square } from "./square";


export class Solver
{
    private readonly rowConstraints: Constraints[];

    private readonly columnConstraints: Constraints[];

    private readonly grid: PersistentGrid<Square>;

    private orientation: 'vertical' | 'horizontal';

    private index: number;

    constructor(rowConstraints: Constraints[], columnConstraints: Constraints[])
    {
        this.rowConstraints = [...rowConstraints];
        this.columnConstraints = [...columnConstraints];
        this.grid = PersistentGrid.create<Square>(columnConstraints.length, rowConstraints.length, _ => ({ status: 'unknown' }));
        this.orientation = 'horizontal';
        this.index = 0;
    }

    step(): boolean
    {
        if ( this.orientation === 'horizontal' )
        {
            const row = this.grid.column(this.index);
            const constraints = this.columnConstraints[this.index];
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
            const constraints = this.rowConstraints[this.index];
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
}