
 
 export const states : string[]  = [ "AL", "AK", "AS", "AZ", "AR", "CA",
    "CO", "CT", "DE", "DC", "FM", "FL", "GA", "GU", "HI", "ID", "IL", "IN",
    "IA", "KS", "KY", "LA", "ME", "MH", "MD", "MA", "MI", "MN", "MS", "MO",
    "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK",
    "OR", "PW", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VI",
    "VA", "WA", "WV", "WI", "WY"];


export const validateState = (state:string) =>{

    const err : string[] = []

    if(state?.length < 1 || !state){
        err.push("State cannot be empty")
    }
    if(state?.length > 2) {
        err.push("Invalid length, max 2")
    }
    if(!states?.includes(state) && state?.length > 0){
       err.push("State not exist")
    }
    return err
}

export const validateAccountName = (name:string) => {
    const err : string[] = []
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    
    if(name?.length < 1 || !name){
        err.push("Name cannot be empty")
    }
    if(name?.length > 100){
        err.push("Character limit exceeds")
    }
    if(name?.length === 0 && !regex.test(name) ) {
        err.push("Invalid account name")
    }

    return err
}

export const validateAddress = (address:string) => {
    const err : string[] = []
    const regex = /^[#.0-9a-zA-Z\s,-]+$/;
    if(address?.length > 100){
        err.push("Character limit exceeds")
    }
    if(address?.length > 0 && !regex.test(address.trim()) ) {
        err.push("Invalid address")
    }

    return err
}

export const validateCity = (city:string)=> {
    const err : string[] = []
    const regex = /^[.0-9a-zA-Z\s,-]+$/;
    if(city?.length > 100){
        err.push("Character limit exceeds")
    }
    if(city?.length > 0 && !regex.test(city) ) {
        err.push("Invalid city")
    }

    return err
}
export const validatePhone = (phone:string)=> {

    const err : string[] = []
    const regex = /^[0-9]+$/;
    if(phone?.length > 20){
        err.push("Character limit exceeds")
    }
    if(phone?.length > 0 && !regex.test(phone) ) {
        err.push("Invalid phone")
    }

    return err
}

export const validateContactName = (c_name:string)=> {
    const err : string[] = []
    const regex = /^[.a-zA-Z\s-]+$/;
    if(c_name?.length > 100){
        err.push("Character limit exceeds")
    }
    if(c_name?.length > 0 && !regex.test(c_name) ) {
        err.push("Invalid contact name")
    }

    return err
}

export const validateZip = (zip:string)=> {
    const err : string[] = []
    const regex = /^[0-9]{5}(?:-[0-9]{4})?$/;
    if(zip?.length > 20){
        err.push("Character limit exceeds")
    }
    if(zip?.length > 0 && !regex.test(zip) ) {
        err.push("Invalid zip code")
    }

    return err
}

export const validateBillingNumbers = (bol:string)=> {
    const err : string[] = []
    const regex = /^\d*$/;

    if(bol?.length > 20){
        err.push("Character limit exceeds")
    }
    if(bol?.length > 0 && !regex.test(bol) ) {
        err.push("Must be numeric")
    }

    return err
}
export const validateProNumber = (pro:string)=> {
    const err : string[] = []
    const regex = /^[a-zA-Z0-9-]*$/;

    if(pro?.length > 20){
        err.push("Character limit exceeds")
    }
    if(pro?.length > 0 && !regex.test(pro) ) {
        err.push("Only accepts alpha numeric and hypen (-) ")
    }

    return err
}
// >>>>>>>>>>>  ITEMS  <<<<<<<<<<<

export const validatePieces = (pieces:string)=> {
    const err : string[] = []
    const regex = /^[0-9]{1,5}$/;

    if(pieces?.length > 6){
        err.push("Character limit exceeds")
    }
    if(pieces?.length > 0 && !regex.test(pieces) ) {
        err.push("Must be numeric")
    }

    return err
}

export const validateWeight = (weight:string)=> {
    const err : string[] = []
    const regex = /^(?:[0-9]{1,5}(?:\.[0-9]?)?)$/;

    if(weight?.length > 6){
        err.push("Character limit exceeds")
    }
    if(weight?.length > 0 && !regex.test(weight) ) {
        err.push("Must be numeric")
    }

    return err
}

export const validateItemClass = (itemClass:string)=> {
    const err : string[] = []
    const regex = /^[0-9a-zA-Z.]+$/;

    if(itemClass?.length > 10){
        err.push("Character limit exceeds")
    }
    if(itemClass?.length > 0 && !regex.test(itemClass) ) {
        err.push("Invalid class")
    }

    return err
}

export const validateNMFC = (nmfc:string)=> {
    const err : string[] = []
    const regex = /^\d*\.?\d+$/;

    if(nmfc?.length > 20){
        err.push("Character limit exceeds")
    }
    if(nmfc?.length > 0 && !regex.test(nmfc) ) {
        err.push("Invalid nmfc")
    }

    return err
}