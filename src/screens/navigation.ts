export interface Navigation
{
    switchTo: (screen: React.ReactNode) => void;

    back: () => void;
}
