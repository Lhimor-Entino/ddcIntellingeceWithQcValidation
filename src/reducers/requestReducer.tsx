import { coookie_options } from "@/config";
import BillingInformation from "@/Mytypes";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const data: any = {
  img_urls: [],
  request_info: {},
  request_json: {} as BillingInformation,
  auto_request: Cookies.get("auto_request") ? Cookies.get("auto_request") === "true" ? true : false : true,
  requesting: false,
  saving: false
}

const requestSlice = createSlice({
  name: "request",
  initialState: data,
  reducers: {
    changeRequestProperty: (state, action) => {
      const { property, newValue } = action.payload;


      state[property] = newValue;
    },
    changeBillingInfoData: (state, action) => {
      const { parent_property, child_property, newValue } = action.payload;
     
      console.log(parent_property)
      // IF THE CONSIGNEE SHIPPER OR BILL TO IS NULL CREATE THE JSON STRUCTURE THE UPDATE IT
      if (!state.request_json[parent_property]) {
        const data_ = {
          code: "",
          name: "",
          contactName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          zipCode: ""
        }


        state.request_json[parent_property] = data_

      }
      state.request_json[parent_property][child_property] = newValue;

      //const allPropertiesAreEmptyStrings = Object.values(state.request_json).every(value => value === '');

    },
    changeItemData: (state, action) => {
      const { index, property, newValue } = action.payload;
      state.request_json.items[index][property] = newValue;
    },
    changeInstructionsData: (state, action) => {
      const { parent_property, index, property, newValue } = action.payload;
      state.request_json.instructions[parent_property][index][property] = newValue;
    },
    changeRequestMode: (state, action) => {
      const { newValue } = action.payload;
      state.auto_request = !state.auto_request;

      Cookies.set("auto_request", newValue, coookie_options)
    },
    addItems: (state) => {
      const data_ = {
        pallet: "",
        handlingUnit: "",
        packageType: "",
        pieces: "",
        description: "",
        weight: "",
        itemClass: "",
        nmfc: "",
        dimension: "",
      }

      if (!state.request_json.items) {
        state.request_json.items = [data_]
      } else {
        state.request_json.items.push(data_);
      }

    },
    addInstruction: (state) => {
      const data_ = {
        "lines": [{
          "code": "",
          "content": ""
        }]
      }


      if (!state.request_json.instructions || JSON.stringify(state.request_json) === "{}") {
        state.request_json.instructions = data_
      } else {

        if(!state.request_json.instructions.lines){
      
          state.request_json.instructions = data_
 
          return
        }
        if (Array.isArray(state.request_json.instructions.lines)) {
         
            state.request_json.instructions.lines.push({
              "code": "",
              "content": ""
            });
          
      
        } else {
          state.request_json.instructions = data_
        }
      }

    },
    setRequestingStatus: (state, action) => {
      const { newValue } = action.payload;
      state.requesting = newValue
    },
    changeSavingStatus: (state, action) => {
      const { newValue } = action.payload;
      state.saving = newValue
    },
    changeOtherData: (state, action) => {
      const { property, newValue } = action.payload;
      state.request_json[property] = newValue;
    },

    requestClearState: () => data,
  },
});

export const { changeSavingStatus, changeOtherData, changeRequestProperty, requestClearState, changeBillingInfoData, changeItemData, changeInstructionsData, changeRequestMode, addItems, addInstruction, setRequestingStatus } =
  requestSlice.actions;
export default requestSlice.reducer;