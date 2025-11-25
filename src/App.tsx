import { useState } from 'react';
import './App.css';
import IntroductionScreen from './screens/IntroductionScreen';


export default function App(): React.ReactNode
{
    const [screen, setScreen] = useState<React.ReactNode>(<IntroductionScreen setScreen={switchScreen} />)

    return screen;

    function switchScreen(screen: React.ReactNode): void
    {
        setScreen(screen);
    }
}

