import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
};

const componentSlice = createSlice({
    name: "component",
    initialState,
    reducers: {
        openComponent: (state) => {
            state.isOpen = true;
        },
        closeComponent: (state) => {
            state.isOpen = false;
        },
        toggleComponent: (state) => {
            state.isOpen = !state.isOpen;
        },
    },
});

export const { openComponent, closeComponent, toggleComponent } = componentSlice.actions;
export default componentSlice.reducer;