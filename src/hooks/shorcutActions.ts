
import { changeBillingInfoData, changeInstructionsData, changeItemData, changeOtherData } from "@/reducers/requestReducer";
import { useDispatch } from "react-redux";

const useShortCutActions = () => {
    const dispatch = useDispatch();
    const removeSpecialChars = (str: string, property: string, isAccount?: boolean, child_property?: string, isItem?: boolean, index?: number,isInstruction?: boolean) => {
        const updated = str.replace(/[^a-zA-Z0-9\s]/g, '');

        if (!isAccount && !isInstruction && !isItem) {
            dispatch(changeOtherData({ newValue: updated, property }))
            return
        }
        if (isItem) {
            dispatch(changeItemData({ newValue: updated, index, property }))
            return
        }
        if(isAccount){
            dispatch(changeBillingInfoData({ newValue: updated, parent_property: property, child_property: child_property }))
            return
        }
        if(isInstruction){
       
            dispatch(changeInstructionsData({ parent_property: "lines", index, property: "content", newValue: updated }))
            return
        }
      
    };
    const removeAlpha = (str: string, property: string, isAccount?: boolean, child_property?: string, isItem?: boolean, index?: number,isInstruction?:boolean) => {

        const updated = str.replace(/[a-zA-Z]/g, '')
      
        if (!isAccount && !isInstruction && !isItem) {
            dispatch(changeOtherData({ newValue: updated, property }))
            return
        }
        if (isItem) {
            dispatch(changeItemData({ newValue: updated, index, property }))
            return
        }
        if(isAccount){
            dispatch(changeBillingInfoData({ newValue: updated, parent_property: property, child_property: child_property }))
            return
        }
        if(isInstruction){
            dispatch(changeInstructionsData({ parent_property: "lines", index, property: "content", newValue: updated }))
            return
        }
    };
    const removeMultipleSpaces =(str: string, property: string, isAccount?: boolean, child_property?: string, isItem?: boolean, index?: number,isInstruction?:boolean) => {

        const updated = str.replace(/\s+/g, ' ').trim();
      
        if (!isAccount && !isInstruction && !isItem) {
            dispatch(changeOtherData({ newValue: updated, property }))
            return
        }
        if (isItem) {
            dispatch(changeItemData({ newValue: updated, index, property }))
            return
        }
        if(isAccount){
            dispatch(changeBillingInfoData({ newValue: updated, parent_property: property, child_property: child_property }))
            return
        }
        if(isInstruction){
            dispatch(changeInstructionsData({ parent_property: "lines", index, property: "content", newValue: updated }))
            return
        }
    }
    const removeAllSpaces =(str: string, property: string, isAccount?: boolean, child_property?: string, isItem?: boolean, index?: number,isInstruction?:boolean) => {

        const updated = str.replace(/\s+/g, '');
        if (!isAccount && !isInstruction && !isItem) {
            dispatch(changeOtherData({ newValue: updated, property }))
            return
        }
        if (isItem) {
            dispatch(changeItemData({ newValue: updated, index, property}))
            return
        }
        if(isAccount){
            dispatch(changeBillingInfoData({ newValue: updated, parent_property: property, child_property: child_property }))
            return
        }
        if(isInstruction){
            dispatch(changeInstructionsData({ parent_property: "lines", index, property: "content", newValue: updated }))
            return
        }
    };
    const removeNumericCharacters = (str: string, property: string, isAccount?: boolean, child_property?: string, isItem?: boolean, index?: number, isInstruction?: boolean) => {
        const updated = str.replace(/[0-9]/g, '');
        if (!isAccount && !isInstruction && !isItem) {
             dispatch(changeOtherData({ newValue: updated, property }))
             return
         }
         if (isItem) {
             dispatch(changeItemData({ newValue: updated, index, property }))
             return
            }
         if (isAccount) {
             dispatch(changeBillingInfoData({ newValue: updated, parent_property: property, child_property: child_property }))
             return
            }
         if (isInstruction) {
             dispatch(changeInstructionsData({ parent_property: "lines", index, property: "content", newValue: updated }))
             return
            }
     }
     const revertToOriginal = (str: string, property: string, isAccount?: boolean, child_property?: string, isItem?: boolean, index?: number, isInstruction?: boolean,) => {
        

        if (!isAccount && !isInstruction && !isItem) {

            dispatch(changeOtherData({ newValue: str, property }))
            return
        }
        if (isItem) {
            dispatch(changeItemData({ newValue: str, index, property }))
            return
        }
        if (isAccount) {
            dispatch(changeBillingInfoData({ newValue: str, parent_property: property, child_property: child_property }))
            return
        }
        if (isInstruction) {
            dispatch(changeInstructionsData({ parent_property: "lines", index, property: "content", newValue: str }))
            return
        }
     }
    return {
        removeAlpha,
        removeMultipleSpaces,
        removeSpecialChars,
        removeAllSpaces,
        removeNumericCharacters,
        revertToOriginal
     
    }

}
export default useShortCutActions