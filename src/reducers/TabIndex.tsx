import { createSlice } from "@reduxjs/toolkit";

const data: any = {
    tabIndex : []
}

const themeSlice = createSlice({
  name: "theme",
  initialState: data,
  reducers: {
    addIndex: (state, action) => {
      const { newValue } = action.payload;

      state.tabIndex.push(newValue) ;
    },
   
    requestClearState: () => data,
  },
});

export const { addIndex, requestClearState} =
themeSlice.actions;
export default themeSlice.reducer;