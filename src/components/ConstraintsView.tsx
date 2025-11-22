import type { IArray } from '@/util/array';
import React from 'react';
import classes from './ConstraintsView.module.css';
import ConstraintView, { type Constraint } from './ConstraintView';


interface Props
{
    orientation: Orientation;
    constraints: Constraints;
}

export interface Constraints
{
    constraints: IArray<Constraint>;
    satisfaction: 'satisfied' | 'unsatisfied' | 'violated';
}

export type Orientation = 'horizontal' | 'vertical';

export default function ConstraintsView(props: Props): React.ReactNode
{
    const { constraints, satisfaction } = props.constraints;

    return (
        <div className={`${classes.constraints} ${classes[props.orientation]} ${classes[satisfaction]}`}>
            {renderConstraints(constraints)}
        </div>
    );


    function renderConstraints(constraints: IArray<Constraint>): React.ReactNode
    {
        return constraints.data.map(renderConstraint);
    }

    function renderConstraint(constraint: Constraint, index: number): React.ReactNode
    {
        return (
            <React.Fragment key={index}>
                <ConstraintView constraint={constraint} />
            </React.Fragment>
        );
    }
}
