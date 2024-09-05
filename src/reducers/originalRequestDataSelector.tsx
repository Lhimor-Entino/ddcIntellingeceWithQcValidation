import { createSelector } from '@reduxjs/toolkit';

 export const selectRequestJson = (state:any) => state.original_request_reducer.request_json;

export const selectData = createSelector(
  [selectRequestJson, (_state, { property, child_property, index, isInstruction }) => ({ property, child_property, index,isInstruction })],
  (requestJson, { property, child_property, index,isInstruction }) => {
   
    if (!requestJson) return
  
    if(isInstruction){
      if(!requestJson.instructions) return;
      if(!requestJson.instructions.lines) return;
      return requestJson.instructions.lines[index]?.content
    }
    // ITEMS
    if (index !== undefined) {

      if(!requestJson.items) return;
      return requestJson.items[index]?.[property];
    }

    if (child_property) {
       
      return requestJson[property]?.[child_property];
      }else{
        return requestJson[property];
      }
  }
);
