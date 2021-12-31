import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'toast',
    initialState: {
        variant: undefined,
        message: undefined
    },
    reducers: {
        toast: (state, { payload: { variant, message } }) => {
            state.variant = variant;
            state.message = message;
        }
    }
});

export const { toast } = slice.actions;

export const toastReducer = slice.reducer;

export const selectToast = state => state.toast;
