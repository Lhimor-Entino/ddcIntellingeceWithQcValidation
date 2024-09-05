
import { createSlice } from "@reduxjs/toolkit";

const data: any = {
  fullscreen : false,
  showImageViewer: true,

}

const viewSlice = createSlice({
  name: "view",
  initialState: data,
  reducers: {
    toggleFullscreen: (state) => {
    
      state.fullscreen = !state.fullscreen;
    },
    toggleImageViewer: (state) => {
    
      state.showImageViewer = !state.showImageViewer;
    },
    requestClearState: () => data,
  },
});

export const { toggleFullscreen, requestClearState,toggleImageViewer} =
viewSlice.actions;
export default viewSlice.reducer;