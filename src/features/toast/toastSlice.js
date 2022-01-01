import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'toast',
    initialState: {
        variant: undefined,
        message: undefined
    },
    reducers: {
        showToast: (state, { payload: { variant, message } }) => {
            state.variant = variant;
            state.message = message;
        },
        hideToast: state => {
            state.variant = undefined;
            state.message = undefined;
        }
    }
});

export const { showToast, hideToast } = slice.actions;

export const toastReducer = slice.reducer;

export const selectToast = state => state.toast;
