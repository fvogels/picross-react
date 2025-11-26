import classes from './ConstraintView.module.css'


interface Props
{
    constraint: Constraint;

    onLeftClick?: () => void;

    onRightClick?: () => void;
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
            <div className={`${classes.inner} ${classes[satisfaction]}`} onMouseDown={onMouseClick} onContextMenu={e => e.preventDefault()}>
                {value}
            </div>
        </div>
    );


    function onMouseClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void
    {
        if ( event.button === 0 )
        {
            props.onLeftClick?.();
            event.preventDefault();
        }
        else if ( event.button === 2 )
        {
            props.onRightClick?.();
            event.preventDefault();
        }
    }
}
