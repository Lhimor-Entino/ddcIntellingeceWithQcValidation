
import { createSlice } from "@reduxjs/toolkit";

const data: any = {
  current_theme : localStorage.getItem("vite-ui-theme") 
}

const themeSlice = createSlice({
  name: "theme",
  initialState: data,
  reducers: {
    changeTheme: (state, action) => {
      const { newValue } = action.payload;


      state.theme = newValue;
    },
   
    requestClearState: () => data,
  },
});

export const { changeTheme, requestClearState} =
themeSlice.actions;
export default themeSlice.reducer;