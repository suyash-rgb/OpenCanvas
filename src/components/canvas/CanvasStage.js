'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';
import { useDrawingLogic } from '../../hooks/useDrawingLogic';
import { setCanvasView, setSelected } from '../../store/canvasSlice';
import StaticLayer from './StaticLayer';
import ActiveLayer from './ActiveLayer';
import ToolPalette from '../ui/ToolPalette';

export default function CanvasStage() {
    const dispatch = useDispatch();
    const stageRef = useRef(null);

    // Use a state for dimensions since window is undefined on server
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const { view, elements } = useSelector((state) => state.canvas);
    const { tool } = view;

    const { handlePointerDown, handlePointerMove, handlePointerUp } = useDrawingLogic(stageRef);

    useEffect(() => {
        // Only access window on the client side
        setDimensions({ width: window.innerWidth, height: window.innerHeight });

        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleWheel = (e) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        // How much to scale. 
        // - evt.deltaY > 0 means zooming out (scrolling down)
        const scaleBy = 1.05;
        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        dispatch(setCanvasView({ scale: newScale, x: newPos.x, y: newPos.y }));
    };

    const handleStageClick = (e) => {
        // Clicked on empty space (not a shape)
        if (e.target === e.target.getStage()) {
            if (elements.selectedIds.length > 0) {
                dispatch(setSelected([]));
            }
        } else {
            // Clicked on a shape
            if (tool === 'selection') {
                const clickedOnTransformer = e.target.getParent().className === 'Transformer';
                if (!clickedOnTransformer) {
                    const id = e.target.id();
                    // To do multi-select, check for shift key here. 
                    // For now, absolute selection:
                    if (id) {
                        dispatch(setSelected([id]));
                    }
                }
            }
        }
    };

    // Prevent hydration errors by not rendering during SSR
    if (dimensions.width === 0) return null;

    return (
        <div className="canvas-container">
            <ToolPalette />

            <Stage
                width={dimensions.width}
                height={dimensions.height}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onClick={handleStageClick}
                onWheel={handleWheel}
                scaleX={view.scale}
                scaleY={view.scale}
                x={view.x}
                y={view.y}
                ref={stageRef}
                draggable={tool === 'selection' && elements.selectedIds.length === 0}
                className="touch-none"
            >
                <Layer name="static">
                    <StaticLayer />
                </Layer>

                <Layer name="active">
                    <ActiveLayer />
                </Layer>
            </Stage>
        </div>
    );
}
