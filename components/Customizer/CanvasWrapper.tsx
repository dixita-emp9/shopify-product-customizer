import { useEffect, useState } from 'react';
import type { CanvasElement } from '../../types';

interface CanvasProps {
    backgroundImageUrl: string;
    elements: CanvasElement[];
    onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
    onSelectElement: (id: string | null) => void;
    selectedId: string | null;
    width: number;
    height: number;
    showAids: boolean;
}

export default function CanvasWrapper(props: CanvasProps) {
    const [Canvas, setCanvas] = useState<React.ComponentType<CanvasProps> | null>(null);

    useEffect(() => {
        // Only import on client side
        import('./CanvasClient').then((module) => {
            setCanvas(() => module.default);
        });
    }, []);

    if (!Canvas) {
        return (
            <div className="flex flex-col h-full w-full bg-white relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading canvas...</p>
                    </div>
                </div>
            </div>
        );
    }

    return <Canvas {...props} />;
}