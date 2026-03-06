import React from 'react';
import { useSelector } from 'react-redux';
import TransformerView from './TransformerView';
import RoughRectangle from '../elements/RoughRectangle';
import Scribble from '../elements/Scribble';

const renderElement = (element) => {
    switch (element.type) {
        case 'rectangle':
            return <RoughRectangle key={element.id} element={element} />;
        case 'scribble':
        case 'arrow':
            return <Scribble key={element.id} element={element} />;
        default:
            return null;
    }
};

const ActiveLayer = () => {
    const elementsById = useSelector((state) => state.canvas.elements.byId);
    const selectedIds = useSelector((state) => state.canvas.elements.selectedIds);

    // Render everything that IS selected OR currently being drawn
    return (
        <>
            {selectedIds.map((id) => {
                const element = elementsById[id];
                return element ? renderElement(element) : null;
            })}

            <TransformerView />
        </>
    );
};

export default ActiveLayer;
