

import { createSlice } from "@reduxjs/toolkit";



const validationSlice = createSlice({
  name: "validation",
  initialState: { errors: [], isValidationOn: false as boolean } as any,
  reducers: {
    addError: (state, action) => {

      const { property, newValue } = action.payload;

      // Check if an error with the same property already exists
      const existingError = state.errors.find((error: any) => error.property === property);

      if (newValue.length < 1) {
        state.errors = state.errors.filter((error: any) => error.property !== property);
      } else {
        if (!existingError) {
          state.errors.push({ property, newValue });
        } else {
          existingError.newValue = newValue;
        }
      }

    },
    toggleValidation: (state) => {
      state.isValidationOn = !state.isValidationOn
    },
    emptyError: (state) => {
      state.errors = []
    }

  },
});

export const { addError, toggleValidation,emptyError } =
  validationSlice.actions;
export default validationSlice.reducer;