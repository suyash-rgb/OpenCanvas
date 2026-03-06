import React, { useRef, useEffect } from 'react';
import { Transformer } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';
import { updateElement } from '../../store/canvasSlice';

const TransformerView = () => {
    const trRef = useRef(null);
    const dispatch = useDispatch();
    const selectedIds = useSelector((state) => state.canvas.elements.selectedIds);
    const elementsById = useSelector((state) => state.canvas.elements.byId);

    useEffect(() => {
        if (selectedIds.length > 0 && trRef.current) {
            // Find the nodes in the stage that match the selected IDs
            // Note: In Konva, getStage() gives access to the global search
            const stage = trRef.current.getStage();
            const nodes = selectedIds.map((id) => stage.findOne(`#${id}`)).filter(Boolean);

            trRef.current.nodes(nodes);
            trRef.current.getLayer().batchDraw();
        } else if (trRef.current) {
            trRef.current.nodes([]);
            trRef.current.getLayer().batchDraw();
        }
    }, [selectedIds, elementsById]);

    const handleTransformEnd = () => {
        const nodes = trRef.current.nodes();
        nodes.forEach((node) => {
            const id = node.id();
            // Konva Transformer adjusts scale for resizing, so we reset scale to 1 
            // and apply the transformation to width and height instead
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            const updates = {
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                // For shapes like rect, we might want to multiply width/height by scale
            };

            // Dispatch updates to Redux
            dispatch(updateElement({ id, updates }));
        });
    };

    if (selectedIds.length === 0) return null;

    return (
        <Transformer
            ref={trRef}
            onTransformEnd={handleTransformEnd}
            boundBoxFunc={(oldBox, newBox) => {
                // Prevent scaling below 5px width/height
                if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                    return oldBox;
                }
                return newBox;
            }}
        />
    );
};

export default TransformerView;
