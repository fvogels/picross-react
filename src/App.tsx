import { useState } from 'react';
import './App.css';
import IntroductionScreen from './screens/IntroductionScreen';
import type { Navigation } from './screens/navigation';


export default function App(): React.ReactNode
{
    const [screenStack, setScreenStack] = useState<React.ReactNode[]>([ createInitialScreen() ])

    return screenStack[screenStack.length-1];


    function pushScreen(screen: React.ReactNode): void
    {
        setScreenStack([...screenStack, screen]);
    }

    function popScreen(): void
    {
        const newStack = [...screenStack];
        newStack.pop();
        setScreenStack(newStack);
    }

    function createInitialScreen(): React.ReactNode
    {
        return (
            <IntroductionScreen navigation={createNavigation()} />
        );
    }

    function createNavigation(): Navigation
    {
        return {
            switchTo: pushScreen,
            back: popScreen,
        };
    }
}
