import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { undo, redo, deleteSelected } from '../store/canvasSlice';

export const useCanvasShortcuts = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if we are typing in an input or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // CMD/CTRL
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const cmdToken = isMac ? e.metaKey : e.ctrlKey;

            if (cmdToken && e.key.toLowerCase() === 'z') {
                if (e.shiftKey) {
                    dispatch(redo());
                } else {
                    dispatch(undo());
                }
                e.preventDefault();
            } else if (cmdToken && e.key.toLowerCase() === 'y') {
                dispatch(redo());
                e.preventDefault();
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                dispatch({ type: 'canvas/saveHistory' });
                dispatch(deleteSelected());
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dispatch]);
};
