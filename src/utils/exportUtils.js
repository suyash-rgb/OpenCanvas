export const exportToJSON = (elements) => {
    // Stringify and format the elements JSON for saving
    const dataStr = JSON.stringify(elements, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'excalidraw-clone.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
};

export const exportToPNG = (stageRef) => {
    if (!stageRef.current) return;

    // We get the data URL from the konva stage
    // To ensure a high quality render we can boost the pixel ratio
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });

    const exportFileDefaultName = 'excalidraw-canvas.png';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURL);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
};
