import classes from './SquareView.module.css';


interface Props
{
    status: 'empty' | 'filled' | 'unknown';
    caption?: string;

    onLeftPressed?: () => void;
    onLeftDragged?: () => void;
    onLeftReleased?: (modifier: boolean) => void;

    onRightPressed?: () => void;
    onRightDragged?: () => void;
    onRightReleased?: () => void;
}

export default function SquareView(props: Props): React.ReactNode
{
    return (
        <div className={`${classes.outer}`} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseEnter={onMouseEnter} draggable={false} onContextMenu={e => e.preventDefault()}>
            <div className={`${classes.inner} ${classes[props.status]}`}>
                {props.caption}
            </div>
        </div>
    );


    function onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>)
    {
        switch ( event.button )
        {
            case 0:
                props.onLeftPressed?.();
                break;

            case 2:
                props.onRightPressed?.();
                break;
        }

        event.preventDefault();
    }

    function onMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>)
    {
        switch ( event.button )
        {
            case 0:
                props.onLeftReleased?.(event.ctrlKey);
                break;

            case 2:
                props.onRightReleased?.();
                break;
        }

        event.preventDefault();
    }

    function onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>)
    {
        switch ( event.button )
        {
            case 0:
                props.onLeftDragged?.();
                break;

            case 2:
                props.onRightDragged?.();
                break;
        }


        event.preventDefault();
    }
}
