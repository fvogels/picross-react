import { PersistentArray } from "@/util/parray";


export interface Constraint
{
    value: number;
    satisfaction: Satisfaction;
};

export type Satisfaction = 'satisfied' | 'unsatisfied' | 'violated';

export interface Constraints
{
    constraints: PersistentArray<Constraint>;
    satisfaction: Satisfaction;
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
