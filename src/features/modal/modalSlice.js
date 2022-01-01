import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'modal',
    initialState: {
        title: undefined,
        body: undefined,
        onOk: undefined
    },
    reducers: {
        showModal: (state, { payload: { title, body, onOk } }) => {
            state.title = title;
            state.body = body;
            state.onOk = onOk;
        },
        hideModal: state => {
            state.title = undefined;
            state.body = undefined;
            state.onOk = undefined;
        }
    }
});

export const { showModal, hideModal } = slice.actions;

export const modalReducer = slice.reducer;

export const selectModal = state => state.modal;
