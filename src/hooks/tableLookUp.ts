import { TableLookUp } from "@/Mytypes"
import { changeBillingInfoData } from "@/reducers/requestReducer"
import { useDispatch } from "react-redux"

const useTableLookUp = () => {
    const dispatch = useDispatch()
    const applyTableLookUp = (lookup: TableLookUp,identifier:string) => {
  
        dispatch(changeBillingInfoData({ newValue: lookup.name, parent_property: identifier, child_property: "name", }))
        dispatch(changeBillingInfoData({ newValue: lookup.address1, parent_property: identifier, child_property: "addressLine1" }))
        dispatch(changeBillingInfoData({ newValue: lookup.address2, parent_property: identifier, child_property: "addressLine2" }))
        dispatch(changeBillingInfoData({ newValue: lookup.city, parent_property: identifier, child_property: "city" }))
        dispatch(changeBillingInfoData({ newValue: lookup.state, parent_property: identifier, child_property: "state" }))
        dispatch(changeBillingInfoData({ newValue: lookup.zip, parent_property: identifier, child_property: "zipCode" }))
        dispatch(changeBillingInfoData({ newValue: lookup.weight, parent_property: identifier, child_property: "weight" }))

    }

    return {
        applyTableLookUp
    }
}
export default useTableLookUp