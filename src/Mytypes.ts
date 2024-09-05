

interface TimeStamps {
    created_at?: string,
    updated_at?: string,

}

export interface InfoFields {
    code?: string;
    name: string;
    contactName: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city: string;
    state: string;

    zipCode: string;
}
export interface TableLookUp {
    address1?: string;
    address2?:string;
    city?: string;
    id?: number;
    name?: string;
    state?: string;
    weight?:number;
    zip?:string
}
export interface ImageUrls {
    url: string
}
interface Instructions {
    line: any
}
export interface Items {
    // code?:string,
    pallet?: string,
    handlingUnit?: string,
    packageType?: string,
    pieces?: string,
    description?: string,
    weight?: string,
    itemClass?: string,
    nmfc?: string,
    dimension?: string


}
export interface ErrMsg {
    status: number,
    details: string,
    message: string,
}

export default interface BillingInformation extends TimeStamps {
    startTime?: string;
    endTime?: string;
    image?: string;
    accountType?: string;
    detectedAccountType?: string
    bolNumber?: string
    masterBolNumber?: string
    poNumber?: string
    quoteNumber?: string
    terms?: string
    shipperNumber?: string
    pronumber?: string
    raNumber?: string
    driverNumber?: string
    runNumber?: string
    cubicFeet?: string
    timeDeparted?: string
    timeArrived?: string
    date?: string
    consignee?: InfoFields;
    shipper?: InfoFields;
    billTo?: InfoFields;
    // references: string;
    instructions?: Instructions;
    items?: Items[];
    totalPalletCount?: string,
    totalHandlingUnit?: string,
    totalPieces?: string,
    totalWeight?: string,
    econtrolNumber?: string
}
