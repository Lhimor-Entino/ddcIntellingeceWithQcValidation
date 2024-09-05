import { Items } from "@/Mytypes";
import { changeOtherData } from "@/reducers/requestReducer";
import { useDispatch } from "react-redux";


const useItemCalculations = () => {


    const dispatch = useDispatch();

    const calculatePallet = (items: Items[]) => {
        const total_pallet = items.reduce((sum, item) => {
            const val = parseInt(item.pallet || "0", 10); // Convert string to number
            return sum + (isNaN(val) ? 0 : val); // Add to sum if valid
        }, 0);
        dispatch(changeOtherData({ newValue: total_pallet, property: "totalPalletCount" }))
    }
    const calculatePieces = (items: Items[]) => {
        const total_pieces = items.reduce((sum, item) => {
            const val = parseInt(item.pieces || "0", 10); // Convert string to number
            return sum + (isNaN(val) ? 0 : val); // Add to sum if valid
        }, 0);
        dispatch(changeOtherData({ newValue: total_pieces, property: "totalPieces" }))
    }

    const calculateUnit = (items: Items[]) => {
        const total_unit = items.reduce((sum, item) => {
            const val = parseInt(item.handlingUnit || "0", 10); // Convert string to number
            return sum + (isNaN(val) ? 0 : val); // Add to sum if valid
        }, 0);
        dispatch(changeOtherData({ newValue: total_unit, property: "totalHandlingUnit" }))
    }


    const calculateWeight = (items: Items[]) => {
        const total_weight = items.reduce((sum, item) => {

            const val = parseFloat(item.weight || "0.0"); // Convert string to float
            return sum + (isNaN(val) ? 0 : val); // Add to sum if valid
        }, 0);
        dispatch(changeOtherData({ newValue: total_weight, property: "totalWeight" }))
    }

    const calculateAllItemsData = (items: Items[]) => {
        calculatePallet(items);
        calculatePieces(items);
        calculateUnit(items);
        calculateWeight(items);
    }

    return {
        calculateAllItemsData
    }

}

export default useItemCalculations;