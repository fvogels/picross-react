import type { Constraints } from "@/domain/constraints";
import ConstraintView, { type Constraint } from "./ConstraintView";
import classes from './EditableConstraintsView.module.css';


interface Props
{
    constraints: Constraints;

    orientation: 'horizontal' | 'vertical';

    onUpdate?: (newValues: Constraints) => void;
}

export default function EditableConstraintsView(props: Props): React.ReactNode
{
    const elements: React.ReactNode[] = [ renderSeparator(0) ];

    props.constraints.values.data.forEach((value, index) => {
        const constraint: Constraint = { value, satisfaction: 'satisfied' };
        const constraintView = (
            <ConstraintView constraint={constraint} key={`constraint${index}`} onLeftClick={() => increaseConstraint(index)} onRightClick={() => decreaseConstraint(index)} />
        );

        elements.push(constraintView);
        elements.push(renderSeparator(index + 1));
    });

    return (
        <div className={`${classes.container} ${classes[props.orientation]}`} onClick={e => e.preventDefault()} onContextMenu={e => e.preventDefault()}>
            {elements}
        </div>
    );


    function renderSeparator(insertionIndex: number): React.ReactNode
    {
        return (
            <div className={classes.separator} onMouseDown={() => onInsert(insertionIndex)} key={`separator${insertionIndex}`}>+</div>
        );
    }

    function onInsert(insertionIndex: number): void
    {
        const updatedConstraints = props.constraints.insert(insertionIndex, 1);
        props.onUpdate?.(updatedConstraints);
    }

    function increaseConstraint(index: number): void
    {
        const updatedConstraints = props.constraints.update(index, i => i + 1);
        props.onUpdate?.(updatedConstraints);
    }

    function decreaseConstraint(index: number): void
    {
        let updatedConstraints = props.constraints.update(index, i => i - 1);

        if ( updatedConstraints.values.at(index) === 0 )
        {
            updatedConstraints = updatedConstraints.removeAt(index);
        }

        props.onUpdate?.(updatedConstraints);
    }
}
