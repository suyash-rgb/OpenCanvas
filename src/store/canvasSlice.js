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
        saveHistory(state) {
            // Keep the last 50 states to prevent massive memory usage
            if (state.history.past.length >= 50) {
                state.history.past.shift();
            }
            // Push deep copy of elements state
            state.history.past.push({
                byId: JSON.parse(JSON.stringify(state.elements.byId)),
                allIds: [...state.elements.allIds]
            });
            // Clear future when new actions are taken
            state.history.future = [];
        },
        undo(state) {
            if (state.history.past.length === 0) return;

            const previous = state.history.past.pop();

            // Save current state to future
            state.history.future.push({
                byId: JSON.parse(JSON.stringify(state.elements.byId)),
                allIds: [...state.elements.allIds]
            });

            // Apply past state
            state.elements.byId = previous.byId;
            state.elements.allIds = previous.allIds;
            state.elements.selectedIds = [];
        },
        redo(state) {
            if (state.history.future.length === 0) return;

            const next = state.history.future.pop();

            // Save current state to past
            state.history.past.push({
                byId: JSON.parse(JSON.stringify(state.elements.byId)),
                allIds: [...state.elements.allIds]
            });

            // Apply future state
            state.elements.byId = next.byId;
            state.elements.allIds = next.allIds;
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
    saveHistory,
    undo,
    redo,
} = canvasSlice.actions;

export default canvasSlice.reducer;
