import classes from './SquareView.module.css';


interface Props
{
    status: 'empty' | 'filled' | 'unknown'
}

export default function SquareView(props: Props): React.ReactNode
{
    const className = classes[props.status];

    return (
        <div style={{width: '64px', height: '64px'}} className={`${classes.square} ${className}`}>

        </div>
    );
}
