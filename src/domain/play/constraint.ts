import { PersistentArray } from "@/util/array";


export interface Constraint
{
    value: number;
    satisfaction: Satisfaction;
};

export type Satisfaction = 'satisfied' | 'unsatisfied' | 'violated';

export class Constraints
{
    public readonly constraints: PersistentArray<Constraint>;

    public readonly satisfaction: Satisfaction;

    constructor(constraints: PersistentArray<Constraint>, satisfaction: Satisfaction)
    {
        this.constraints = constraints;
        this.satisfaction = satisfaction;
    }
}

export function createConstraints(values: number[]): Constraints
{
    const contents: PersistentArray<Constraint> = PersistentArray.fromArray(values.map(value => ({ value, satisfaction: 'unsatisfied' })));
    const satisfaction: Satisfaction = 'unsatisfied';

    return { constraints: contents, satisfaction };
}

export function createConstraintsList(...constraints: number[][]): PersistentArray<Constraints>
{
    return PersistentArray.fromArray(constraints.map(createConstraints));
}

