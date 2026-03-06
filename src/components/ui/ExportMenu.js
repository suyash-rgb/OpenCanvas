import React from 'react';
import { useSelector } from 'react-redux';
import { exportToJSON, exportToPNG } from '../../utils/exportUtils';
import { Download, Image as ImageIcon } from 'lucide-react';

export default function ExportMenu({ stageRef }) {
    // For JSON we fetch all elements
    const elements = useSelector((state) => state.canvas.elements);

    return (
        <div
            className="absolute top-4 right-4 bg-white rounded-lg shadow-md border border-gray-200 p-2 flex space-x-2 z-10"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <button
                onClick={() => exportToJSON(elements.byId)}
                className="tool-btn bg-gray-50 hover:bg-gray-100 flex items-center gap-2 px-3 py-1.5"
                title="Export JSON"
            >
                <Download size={16} />
                <span className="text-sm font-medium">JSON</span>
            </button>
            <button
                onClick={() => exportToPNG(stageRef)}
                className="tool-btn bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center gap-2 px-3 py-1.5"
                title="Export PNG"
            >
                <ImageIcon size={16} />
                <span className="text-sm font-medium">PNG</span>
            </button>
        </div>
    );
}
