import { createSlice } from '@reduxjs/toolkit';

export const canvasSlice = createSlice({
    name: 'canvas',
    initialState: {
        view: {
            x: 0,
            y: 0,
            scale: 1,
            tool: 'selection', // selection, rectangle, arrow, scribble, text
        },
        elements: {
            byId: {},
            allIds: [],
            selectedIds: [],
        },
        history: {
            past: [],
            future: [],
        },
    },
    reducers: {
        setTool(state, action) {
            state.view.tool = action.payload;
        },
        setCanvasView(state, action) {
            if (action.payload.x !== undefined) state.view.x = action.payload.x;
            if (action.payload.y !== undefined) state.view.y = action.payload.y;
            if (action.payload.scale !== undefined) state.view.scale = action.payload.scale;
        },
        addElement(state, action) {
            const { id } = action.payload;
            state.elements.byId[id] = action.payload;
            state.elements.allIds.push(id);
        },
        updateElement(state, action) {
            const { id, updates } = action.payload;
            if (state.elements.byId[id]) {
                state.elements.byId[id] = { ...state.elements.byId[id], ...updates };
            }
        },
        setSelected(state, action) {
            state.elements.selectedIds = action.payload;
        },
        deleteSelected(state) {
            state.elements.selectedIds.forEach((id) => {
                delete state.elements.byId[id];
                state.elements.allIds = state.elements.allIds.filter((elId) => elId !== id);
            });
            state.elements.selectedIds = [];
        },
    },
});

export const {
    setTool,
    setCanvasView,
    addElement,
    updateElement,
    setSelected,
    deleteSelected,
} = canvasSlice.actions;

export default canvasSlice.reducer;
