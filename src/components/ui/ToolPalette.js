import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTool } from '../../store/canvasSlice';
import { MousePointer2, Square, PenLine, ArrowUpRight } from 'lucide-react';

const tools = [
    { id: 'selection', icon: MousePointer2, label: 'Selection' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'arrow', icon: ArrowUpRight, label: 'Arrow' },
    { id: 'scribble', icon: PenLine, label: 'Draw' },
];

export default function ToolPalette() {
    const dispatch = useDispatch();
    const currentTool = useSelector((state) => state.canvas.view.tool);

    return (
        <div
            className="excalidraw-palette"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            {tools.map((t) => {
                const Icon = t.icon;
                const isActive = currentTool === t.id;

                return (
                    <button
                        key={t.id}
                        title={t.label}
                        onClick={() => dispatch(setTool(t.id))}
                        className={`tool-btn ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={20} />
                    </button>
                );
            })}
        </div>
    );
}
