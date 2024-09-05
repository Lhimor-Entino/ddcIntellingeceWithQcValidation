
import BillingInformation from "@/Mytypes";
import { createSlice } from "@reduxjs/toolkit";

const data: any = {

    request_json: {} as BillingInformation,

}
const ocr_slice = createSlice({
    name: "ocr_data",
    initialState: data,
    reducers: {
        changeOcrProperty: (state, action) => {
            const { property, newValue } = action.payload;
            state[property] = newValue;
        },
        requestClearState: () => data,
    },
});

export const { changeOcrProperty, requestClearState } =
ocr_slice.actions;
export default ocr_slice.reducer;