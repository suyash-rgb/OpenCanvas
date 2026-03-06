import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addElement, updateElement, setSelected } from '../store/canvasSlice';
import { v4 as uuidv4 } from 'uuid';

export const useDrawingLogic = (stageRef) => {
    const dispatch = useDispatch();
    const { tool, scale } = useSelector((state) => state.canvas.view);
    const [isDrawing, setIsDrawing] = useState(false);
    const currentShapeId = useRef(null);
    const pointsRef = useRef([]); // Track points mutable for performance during draw

    const getPointerPosition = () => {
        const stage = stageRef.current;
        if (!stage) return { x: 0, y: 0 };
        const pointerPos = stage.getPointerPosition();
        const stagePos = stage.position();
        // Adjust for pan and zoom
        return {
            x: (pointerPos.x - stagePos.x) / stage.scaleX(),
            y: (pointerPos.y - stagePos.y) / stage.scaleY(),
        };
    };

    const handlePointerDown = (e) => {
        if (tool === 'selection') return;

        setIsDrawing(true);
        const pos = getPointerPosition();

        const id = uuidv4();
        currentShapeId.current = id;
        pointsRef.current = [pos.x, pos.y];

        dispatch(
            addElement({
                id,
                type: tool,
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                points: [...pointsRef.current],
                strokeColor: tool === 'selection' ? '#0000ff' : '#000000',
                roughness: 1,
                strokeWidth: 2,
                zIndex: 0,
            })
        );
    };

    const handlePointerMove = (e) => {
        if (!isDrawing || !currentShapeId.current) return;

        const pos = getPointerPosition();

        // If it's a scribble or line, append points
        if (tool === 'scribble' || tool === 'arrow') {
            pointsRef.current.push(pos.x, pos.y);
            dispatch(
                updateElement({
                    id: currentShapeId.current,
                    updates: {
                        points: [...pointsRef.current],
                    },
                })
            );
        } else {
            // If it's a rectangle, update width and height
            const startX = pointsRef.current[0];
            const startY = pointsRef.current[1];
            dispatch(
                updateElement({
                    id: currentShapeId.current,
                    updates: {
                        width: pos.x - startX,
                        height: pos.y - startY,
                    },
                })
            );
        }
    };

    const handlePointerUp = () => {
        if (isDrawing) {
            setIsDrawing(false);
            // Auto-select the newly drawn item
            if (currentShapeId.current && tool !== 'selection') {
                dispatch(setSelected([currentShapeId.current]));
            }
            currentShapeId.current = null;
        }
    };

    return { handlePointerDown, handlePointerMove, handlePointerUp, isDrawing };
};
