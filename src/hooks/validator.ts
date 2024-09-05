import { useDispatch } from 'react-redux';
import { addError } from '@/reducers/validationReducer';
import { validateState, validateAccountName, validateAddress, validateCity, validatePhone, validateContactName, validateZip, validatePieces , validateWeight, validateItemClass, validateNMFC, validateBillingNumbers, validateProNumber } from '../MyComponents/validationHelper';

const useValidation = () => {
  const dispatch = useDispatch();

  const validateConsignee = (request_data: any) => {
    const state_res = validateState(request_data.request_json.consignee?.state);
    const account_name_res = validateAccountName(request_data.request_json.consignee?.name);
    const address1_res = validateAddress(request_data.request_json.consignee?.addressLine1);
    const address2_res = validateAddress(request_data.request_json.consignee?.addressLine2);
    const city_res = validateCity(request_data.request_json.consignee?.city);
    const phone_res = validatePhone(request_data.request_json.consignee?.phone);
    const contact_res = validateContactName(request_data.request_json.consignee?.contactName);
    const zip_res = validateZip(request_data.request_json.consignee?.zipCode);
    dispatch(addError({ property: "consignee-state", newValue: state_res }));
    dispatch(addError({ property: "consignee-name", newValue: account_name_res }));
    dispatch(addError({ property: "consignee-addressLine1", newValue: address1_res }));
    dispatch(addError({ property: "consignee-addressLine2", newValue: address2_res }));
    dispatch(addError({ property: "consignee-city", newValue: city_res }));
    dispatch(addError({ property: "consignee-phone", newValue: phone_res }));
    dispatch(addError({ property: "consignee-contactName", newValue: contact_res }));
    dispatch(addError({ property: "consignee-zipCode", newValue: zip_res }));
  };

  const validateShipper = (request_data: any) => {
    const state_res = validateState(request_data.request_json.shipper?.state);
    const account_name_res = validateAccountName(request_data.request_json.shipper?.name);
    const address1_res = validateAddress(request_data.request_json.shipper?.addressLine1);
    const address2_res = validateAddress(request_data.request_json.shipper?.addressLine2);
    const city_res = validateCity(request_data.request_json.shipper?.city);
    const phone_res = validatePhone(request_data.request_json.shipper?.phone);
    const contact_res = validateContactName(request_data.request_json.shipper?.contactName);
    const zip_res = validateZip(request_data.request_json.shipper?.zipCode);

    dispatch(addError({ property: "shipper-state", newValue: state_res }));
    dispatch(addError({ property: "shipper-name", newValue: account_name_res }));
    dispatch(addError({ property: "shipper-addressLine1", newValue: address1_res }));
    dispatch(addError({ property: "shipper-addressLine2", newValue: address2_res }));
    dispatch(addError({ property: "shipper-city", newValue: city_res }));
    dispatch(addError({ property: "shipper-phone", newValue: phone_res }));
    dispatch(addError({ property: "shipper-contactName", newValue: contact_res }));
    dispatch(addError({ property: "shipper-zipCode", newValue: zip_res }));
  };

  const validateBillTo = (request_data: any) => {
    const state_res = validateState(request_data.request_json.billTo?.state);
    const account_name_res = validateAccountName(request_data.request_json.billTo?.name);
    const address1_res = validateAddress(request_data.request_json.billTo?.addressLine1);
    const address2_res = validateAddress(request_data.request_json.billTo?.addressLine2);
    const city_res = validateCity(request_data.request_json.billTo?.city);
    const phone_res = validatePhone(request_data.request_json.billTo?.phone);
    const contact_res = validateContactName(request_data.request_json.billTo?.contactName);
    const zip_res = validateZip(request_data.request_json.billTo?.zipCode);

    dispatch(addError({ property: "billTo-state", newValue: state_res }));
    dispatch(addError({ property: "billTo-name", newValue: account_name_res }));
    dispatch(addError({ property: "billTo-addressLine1", newValue: address1_res }));
    dispatch(addError({ property: "billTo-addressLine2", newValue: address2_res }));
    dispatch(addError({ property: "billTo-city", newValue: city_res }));
    dispatch(addError({ property: "billTo-phone", newValue: phone_res }));
    dispatch(addError({ property: "billTo-contactName", newValue: contact_res }));
    dispatch(addError({ property: "billTo-zipCode", newValue: zip_res }));
  };
  const validateOtherFiels = (request_data:any)=>{
  
    const bol_res = validateBillingNumbers(request_data.request_json.bolNumber)
    const driver_res = validateBillingNumbers(request_data.request_json.driverNumber)
    const econtrolNumber_res = validateBillingNumbers(request_data.request_json.econtrolNumber)
    const masterBolNumber_res = validateBillingNumbers(request_data.request_json.masterBolNumber)
    const poNumber_res = validateBillingNumbers(request_data.request_json.poNumber)
    const quoteNumber_res = validateBillingNumbers(request_data.request_json.quoteNumber)
    const raNumber_res = validateBillingNumbers(request_data.request_json.raNumber)
    const runNumber_res = validateBillingNumbers(request_data.request_json.runNumber)
    const shipperNumber_res = validateBillingNumbers(request_data.request_json.shipperNumber)
    const pronumber_res = validateProNumber(request_data.request_json.pronumber)
    dispatch(addError({ property: "bolNumber", newValue: bol_res }));
    dispatch(addError({ property: "driverNumber", newValue: driver_res }));
    dispatch(addError({ property: "econtrolNumber", newValue: econtrolNumber_res }));
    dispatch(addError({ property: "masterBolNumber", newValue: masterBolNumber_res }));
    dispatch(addError({ property: "poNumber", newValue: poNumber_res }));
    dispatch(addError({ property: "quoteNumber", newValue: quoteNumber_res }));
    dispatch(addError({ property: "raNumber", newValue: raNumber_res }));
    dispatch(addError({ property: "runNumber", newValue: runNumber_res }));
    dispatch(addError({ property: "shipperNumber", newValue: shipperNumber_res }));
    dispatch(addError({ property: "pronumber", newValue: pronumber_res }));
  }

  const validateData = (request_data:any) => {
    validateConsignee(request_data)
    validateShipper(request_data)
    validateBillTo(request_data)
    validateOtherFiels(request_data)
    
  }
  return {
    validateData
  };
};


export const useItemValidation = () => {
    const dispatch = useDispatch();
    const validate = (request_data: any) => {
        

        request_data.request_json.items?.forEach((item :any,index:number) => {
         
           let pieces_res =  validatePieces(item.pieces)
           let weight_res =  validateWeight(item.weight)
           let item_class_res = validateItemClass(item.itemClass)
           let nmfc_res = validateNMFC(item.nmfc)
           dispatch(addError({ property: `${index}-pieces`, newValue: pieces_res }));
           dispatch(addError({ property: `${index}-weight`, newValue: weight_res }));
           dispatch(addError({ property: `${index}-itemClass`, newValue: item_class_res }));
           dispatch(addError({ property: `${index}-nmfc`, newValue: nmfc_res }));
        });
    }
   
    const validateItems = (request_data: any) =>{
        validate(request_data)
    }

    return {
        validateItems
    }
}
export default useValidation;
