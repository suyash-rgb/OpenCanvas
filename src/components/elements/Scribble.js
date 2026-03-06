import React from 'react';
import { Line } from 'react-konva';

const Scribble = ({ element }) => {
    const { points, strokeColor, strokeWidth, id } = element;

    return (
        <Line
            id={id}
            points={points}
            stroke={strokeColor}
            strokeWidth={strokeWidth || 2}
            tension={0.5} // Konva native smoothing for scribbles
            lineCap="round"
            lineJoin="round"
            hitStrokeWidth={15}
            draggable={false}
        />
    );
};

export default Scribble;
