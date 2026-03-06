import React from 'react';
import { Text } from 'react-konva';
import { useDispatch } from 'react-redux';
import { updateElement } from '../../store/canvasSlice';

const CanvasText = ({ element }) => {
    const { x, y, width, height, strokeColor, id, text } = element;
    const dispatch = useDispatch();

    const handleDoubleClick = () => {
        const newText = window.prompt("Edit text:", text || "");
        if (newText !== null) {
            dispatch({ type: 'canvas/saveHistory' });
            dispatch(updateElement({ id, updates: { text: newText } }));
        }
    };

    return (
        <Text
            id={id}
            x={x}
            y={y}
            text={text || 'Double click to edit'}
            fontSize={24}
            fontFamily="Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
            fill={strokeColor}
            width={width > 0 ? width : undefined}
            height={height > 0 ? height : undefined}
            wrap="word"
            hitStrokeWidth={15}
            draggable={false}
            onDblClick={handleDoubleClick}
            onDblTap={handleDoubleClick}
        />
    );
};

export default CanvasText;
