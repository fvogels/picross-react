import classes from './ConstraintView.module.css'


interface Props
{
    constraint: Constraint;
}

export interface Constraint
{
    value: number;
    satisfaction: 'satisfied' | 'unsatisfied' | 'violated';
}

export default function ConstraintView(props: Props): React.ReactNode
{
    const { value, satisfaction } = props.constraint;

    return (
        <div className={classes.outer}>
            <div className={`${classes.inner} ${classes[satisfaction]}`}>
                {value}
            </div>
        </div>
    );
}
