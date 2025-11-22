import classes from './SquareView.module.css';


interface Props
{
    status: 'empty' | 'filled' | 'unknown';
    caption?: string;

    onLeftPressed?: () => void;
    onLeftDragged?: () => void;
    onLeftReleased?: () => void;

    onRightPressed?: () => void;
    onRightDragged?: () => void;
    onRightReleased?: () => void;
}

export default function SquareView(props: Props): React.ReactNode
{
    const className = classes[props.status];

    return (
        <div style={{width: '64px', height: '64px'}} className={`${classes.square} ${className}`} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseEnter={onMouseEnter} draggable={false} onContextMenu={e => e.preventDefault()}>
            {props.caption}
        </div>
    );


    function onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>)
    {
        if ( (event.buttons & 1) !== 0 )
        {
            props.onLeftPressed?.();
        }
        else if ( (event.buttons & 2) !== 0 )
        {
            props.onRightPressed?.();
        }

        event.preventDefault();
    }

    function onMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>)
    {
        if ( (event.buttons & 1) !== 0 )
        {
            props.onLeftReleased?.();
        }
        else if ( (event.buttons & 2) !== 0 )
        {
            props.onRightReleased?.();
        }

        event.preventDefault();
    }

    function onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>)
    {
        if ( (event.buttons & 1) !== 0 )
        {
            props.onLeftDragged?.();
        }
        else if ( (event.buttons & 2) !== 0 )
        {
            props.onRightDragged?.();
        }

        event.preventDefault();
    }
}
