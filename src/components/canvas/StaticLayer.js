import React from 'react';
import { useSelector } from 'react-redux';
import RoughRectangle from '../elements/RoughRectangle';
import RoughEllipse from '../elements/RoughEllipse';
import CanvasText from '../elements/CanvasText';
import Scribble from '../elements/Scribble';

const renderElement = (element) => {
    switch (element.type) {
        case 'rectangle':
            return <RoughRectangle key={element.id} element={element} />;
        case 'ellipse':
            return <RoughEllipse key={element.id} element={element} />;
        case 'text':
            return <CanvasText key={element.id} element={element} />;
        case 'scribble':
        case 'arrow':
            return <Scribble key={element.id} element={element} />;
        default:
            return null;
    }
};

const StaticLayer = () => {
    const elementsById = useSelector((state) => state.canvas.elements.byId);
    const allIds = useSelector((state) => state.canvas.elements.allIds);
    const selectedIds = useSelector((state) => state.canvas.elements.selectedIds);

    // Render everything NOT selected (static background)
    const staticIds = allIds.filter((id) => !selectedIds.includes(id));

    return (
        <>
            {staticIds.map((id) => {
                const element = elementsById[id];
                return renderElement(element);
            })}
        </>
    );
};

export default StaticLayer;
