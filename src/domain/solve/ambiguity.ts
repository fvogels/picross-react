import { Solver } from "./solver";
import type { Grid } from "@/util/grid";
import type { List } from "@/util/list";
import type { Constraints } from "@/domain/constraints";


export class AmbiguityChecker
{
    private readonly solver: Solver;

    readonly ambiguities: Grid<boolean>;

    constructor(rowConstraints: List<Constraints>, columnConstraints: List<Constraints>)
    {
        this.solver = new Solver(rowConstraints, columnConstraints);
        this.solver.solve();
        this.ambiguities = this.solver.solution.virtualMap(s => s === 'unknown');
    }
}