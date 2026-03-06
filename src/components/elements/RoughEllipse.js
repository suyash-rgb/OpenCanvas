import React from 'react';
import { Path } from 'react-konva';
import { generator, getSvgPathFromStroke } from '../../utils/roughGenerator';

const RoughEllipse = ({ element }) => {
    const { x, y, width, height, strokeColor, strokeWidth, roughness } = element;

    // Rough.js ellipse takes center coordinates and width/height. 
    // Since our x/y is top-left in the drawing logic, we translate it to center.
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    const drawable = generator.ellipse(centerX, centerY, width, height, {
        roughness: roughness || 1,
        stroke: strokeColor,
        strokeWidth: strokeWidth || 2,
        seed: element.id.charCodeAt(0), // Persistent seed for identical rendering
    });

    const pathData = getSvgPathFromStroke(drawable.sets);

    return (
        <Path
            id={element.id}
            data={pathData}
            stroke={strokeColor}
            strokeWidth={strokeWidth || 2}
            hitStrokeWidth={15}
            draggable={false}
        />
    );
};

export default RoughEllipse;
