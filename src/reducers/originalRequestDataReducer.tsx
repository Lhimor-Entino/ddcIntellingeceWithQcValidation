
import BillingInformation from "@/Mytypes";
import { createSlice } from "@reduxjs/toolkit";

const data: any = {
  request_json: {} as BillingInformation,
}

const originalSlice = createSlice({
  name: "original",
  initialState: data,
  reducers: {
    changeData: (state, action) => {
      const { property, newValue } = action.payload;


      state[property] = newValue;
    },

    getData: (state, action) => {
      const { property, child_property, index } = action.payload;

      let or_data = ""

      console.log(property,child_property)
      console.log(state.request_json)
      if (child_property) {
        or_data = state.request_json[property]?.[child_property];

        console.log("here", or_data)
      
      } 

      if (index !== undefined) {
        or_data = state.request_json.items[index][property]
      }

      console.log(state.request_json)
      return or_data

    },
    requestClearState: () => data,

  },
});

export const { changeData,getData, requestClearState } =
  originalSlice.actions;
export default originalSlice.reducer;