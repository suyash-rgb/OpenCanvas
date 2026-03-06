import React from 'react';
import { Path } from 'react-konva';
import { generator, getSvgPathFromStroke } from '../../utils/roughGenerator';

const RoughRectangle = ({ element }) => {
    const { x, y, width, height, strokeColor, strokeWidth, roughness } = element;

    // Create rough SVG path for a rectangle
    const drawable = generator.rectangle(0, 0, width, height, {
        roughness: roughness || 1,
        stroke: strokeColor,
        strokeWidth: strokeWidth || 2,
        seed: element.id.charCodeAt(0), // Persistent seed for identical rendering
    });

    const pathData = getSvgPathFromStroke(drawable.sets);

    return (
        <Path
            id={element.id}
            x={x}
            y={y}
            data={pathData}
            stroke={strokeColor}
            strokeWidth={strokeWidth || 2}
            hitStrokeWidth={15} // Thick hit area for easy selection
            draggable={false} // Handled by Redux / Transformer
        />
    );
};

export default RoughRectangle;
