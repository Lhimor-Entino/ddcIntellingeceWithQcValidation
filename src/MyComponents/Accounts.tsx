import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TableLookUp } from "@/Mytypes";

import { changeBillingInfoData } from "@/reducers/requestReducer";
import { CircleAlertIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,

} from "@/components/ui/command"

import AccountsInputWrapper from "./AccountsInputWrapper";
import { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import useAuthValidatorAlerts from "@/hooks/authValidatorAlerts";
import TableLookup from "./TableLookup";
import { toast } from "sonner";
import { coookie_options } from "@/config";
interface AccountProps {
    api: AxiosInstance
    identifier?: string
    label: string
    savingRef: any
}

export function Accounts(props: AccountProps) {
    const dispatch = useDispatch();
    const { tokenExpired } = useAuthValidatorAlerts();
    const { identifier, api, savingRef } = props
    const request_data = useSelector((state: any) => state.request_reducer);
    const ocr_data = useSelector((state: any) => state.ocr_data);
    const original_data = useSelector((state: any) => state.original_request_reducer);
    // const dataFields_: InfoFields = useMemo(() => identifier === "consignee" ? request_data.request_json.consignee : identifier === "shipper" ? request_data.request_json.shipper : request_data.request_json.billTo, [request_data, request_data.request_json]);
    const requesting = useMemo(() => request_data.requesting, [request_data]);
    const validation_data = useSelector((state: any) => state.validation_Reducer);
    const [tableLookUp, setTableLookUp] = useState<TableLookUp[]>([])
    const [noData, _setNoData] = useState<boolean>(false)
    const [openLookUp, setOpenLookUp] = useState<boolean>(false)

    const [pressedKey, setPressedKey] = useState<any>(null)
    const inputRef = useRef<HTMLInputElement | null>(null);
    // const [selectedTableLookup, setSelectedTableLookup] = useState<number>(.0)
    // useEffect(() => {
    //     if (JSON.stringify(request_data.request_json) !== "{}") {
    //         setNoData(false)
    //     } else {
    //         setNoData(true)
    //     }
    // }, [request_data])

    const renderErr = (property: string) => {

        const existingError = validation_data.errors.find((error: any) => error.property === property);

        if (!existingError) return null;
        if (existingError?.newValue.length < 1) return null;
        return (

            <Popover>
                <PopoverTrigger>
                    <CircleAlertIcon className=" hover:cursor-pointer absolute w-3 h-3 right-1  text-red-800" style={{ top: "10%" }} />
                </PopoverTrigger>
                <PopoverContent>
                    <Command className="rounded-lg bg-red-200  ">

                        <CommandList>

                            <CommandGroup heading={<p className="font-extrabold text-md uppercase">{property} Errors</p>}>

                                {
                                    validation_data.errors.filter((item: any) => item.property === property).flatMap((item: any, index: number) =>
                                        item.newValue.map((message: string, messageIndex: number) => (

                                            <CommandItem key={`${index}-${messageIndex}`}>

                                                <span className="text-slate-900 font-bold" style={{ color: "#000" }}>{messageIndex + 1 + ".)"} &nbsp;{message}.</span>
                                            </CommandItem>
                                        ))
                                    )
                                }

                            </CommandGroup>


                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

        )

    };

    const getValue = () => {
        if (identifier === "consignee") return request_data.request_json.consignee;
        if (identifier === "shipper") return request_data.request_json.shipper

        return request_data.request_json.billTo
    }

    const getValueOcrVal = () => {
        if (identifier === "consignee") return ocr_data.request_json.consignee;
        if (identifier === "shipper") return ocr_data.request_json.shipper

        return ocr_data.request_json.billTo
    }




    const getOriginalValue = () => {
        if (identifier === "consignee") return original_data.request_json.consignee;
        if (identifier === "shipper") return original_data.request_json.shipper

        return original_data.request_json.billTo
    }
    const getTableLookup = async () => {

        try {

            const response = await api.get(`/lookup/search?type=${identifier}&address=${getValue()?.addressLine1}&name=${getValue()?.name}`, {
                // const response = await api.get(`/lookup/search?type=shipper&address=THOMASTON DELUXE FEEDS&name=KENT NUTRITION GROUP`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get("jt")}`
                },
            })
            if (response.data.details) {
                setTableLookUp(response.data.details.list)
                console.log(response)
                setOpenLookUp(true)
            } else {
                toast.info('Nothing found ', {
                    description: 'No table lookup available',
                    duration: 3000
                })
            }
        } catch (error: any) {
            console.log(error)
            if (error.response?.data.status == "403") {
                tokenExpired()
            }
        }
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const val = e.target.value
        if (val === "?") {
            getTableLookup()
        } else {
            dispatch(changeBillingInfoData({ newValue: val, parent_property: identifier, child_property: "code", }))
        }


    }
    // Function to handle key press events
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, tabIndex: number | null, child_property?: string, ocr_data?: string, original_data?: string) => {
        if (e.altKey && e.key === "1") {
            e.preventDefault()
            if (!isQc()) return
            setPressedKey(1)
            inputRef.current = e.currentTarget;
            if (inputRef.current) {
                inputRef.current.style.backgroundColor = "#50B498"
            }
            dispatch(changeBillingInfoData({ newValue: ocr_data, parent_property: identifier, child_property: child_property, }))

            return
        }
        if (e.altKey && e.key === "2") {
            e.preventDefault()
            if (!isQc()) return
            setPressedKey(2)
            dispatch(changeBillingInfoData({ newValue: original_data, parent_property: identifier, child_property: child_property, }))
            //   dispatch(changeOtherData({ newValue: original_data, property }))
            inputRef.current = e.currentTarget;
            if (inputRef.current) {
                inputRef.current.style.backgroundColor = "transparent"
            }
            return
        }
        if (e.altKey && e.key === "3") {

            e.preventDefault()
            if (!isQc()) return
            if (pressedKey === 3) {
                setPressedKey(null)

                if (inputRef.current) {
                    inputRef.current.style.backgroundColor = "transparent"
                }
                return
            }
            inputRef.current = e.currentTarget;
            if (inputRef.current) {
                inputRef.current.style.backgroundColor = '#FABC3F'; // or any color you like
            }
            setPressedKey(3)

            // keyRef.current = 1
            //  dispatch(changeOtherData({ newValue: original_data, property }))
            return
        }

        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default Enter behavior
            if (tabIndex !== null) {
                // Find the next input element based on tabIndex
                const nextInput = document.querySelector(`input[tabIndex="${tabIndex}"]`) as HTMLInputElement;
                if (nextInput) {
                    nextInput.focus(); // Focus on the next input
                }
            }
        }
    };

    const getTabIndex = (pos: number) => {
        const startIndex = identifier === "consignee" ? 20 : identifier === "shipper" ? 11 : 29

        return startIndex + pos
    }

    const handleOnChange = (value: string, child_property: string) => {

        if (Cookies.get("role") === "ROLE_QC") {

            if (pressedKey === 1) {
                setPressedKey(null)
                return
            }
            if (pressedKey === 2) {
                setPressedKey(null)
                return
            }
            if (pressedKey === 3) {
                setPressedKey(3)
                // if (!firstKey) {
                dispatch(changeBillingInfoData({ newValue: value, parent_property: identifier, child_property: child_property, }))
                //   }


                return
            }
            return
        }

        dispatch(changeBillingInfoData({ newValue: value, parent_property: identifier, child_property: child_property, }))
    }
    const isQc = () => {
        if (Cookies.get("role") === "ROLE_QC") return true

        return false
    }

    useEffect(() => {

        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.backgroundColor = "transparent";
        });

        if (inputRef.current) {

            inputRef.current.style.backgroundColor = "transparent"
        }
        //  inputRef.current?.style.backgroundColor = "transparent"
        inputRef.current = null
    }, [original_data, savingRef])


    const isMisMatch = (value: any, ocr_data: any, tabIndex: number) => {


        if (value === undefined && ocr_data === null || value === null && ocr_data === undefined || value === "" && ocr_data === "") {
            return false
        }
        if (value !== ocr_data) {


            if (!Cookies.get("tabIndex")) {
                Cookies.set("tabIndex", JSON.stringify([tabIndex]), coookie_options)
                return true
            }

            
            let indexes = JSON.parse(Cookies.get("tabIndex") || "")
            if(!indexes.includes(tabIndex)){
                indexes.push(tabIndex)
                Cookies.set("tabIndex", JSON.stringify(indexes), coookie_options)
            }
            
            return true
        }



    }

    // const getValueOcrVal_ = (property: string) => {

    //     console.log(ocr_data)
    //     if (identifier === "consignee") {
    //         try {
    //             return ocr_data.request_json.consignee[property];
    //         } catch (error) {
    //             return undefined;
    //         }

    //     }

    //     if (identifier === "shipper") {
    //         try {
    //             return ocr_data.request_json.shipper[property]

    //         } catch (error) {
    //             return undefined;
    //         }
    //     }
    //     try {
    //         return ocr_data.request_json.billTo[property]

    //     } catch (error) {
    //         return undefined;
    //     }

    // }

    // const obj = [{ field: "code", pos: 0 },
    // { field: "name", pos: 1 },
    // { field: "addressLine1", pos: 2 },
    // { field: "addressLine2", pos: 3 },
    // { field: "city", pos: 4 },
    // { field: "state", pos: 5 },
    // { field: "zipCode", pos: 6 },
    // { field: "phone", pos: 7 },
    // { field: "contactName", pos: 8 }]
    // const getOriginalValue_ = (property: string) => {

    //     if (identifier === "consignee") {
    //         try {
    //             return original_data.request_json.consignee[property];
    //         } catch (error) {
    //             return undefined;
    //         }

    //     }

    //     if (identifier === "shipper") {
    //         try {
    //             return original_data.request_json.shipper[property]

    //         } catch (error) {
    //             return undefined;
    //         }
    //     }
    //     try {
    //         return original_data.request_json.billTo[property]

    //     } catch (error) {
    //         return undefined;
    //     }
    // }

    // useEffect(() => {
    //     obj.map((o, index) => {

    //         if (isMisMatch(getOriginalValue_(o.field), getValueOcrVal_(o.field))) {



    //             let indexes = JSON.parse(Cookies.get("tabIndex") || "")
    //             indexes.push(getTabIndex(o.pos))         
    //             Cookies.set("tabIndex", JSON.stringify(indexes), coookie_options)
    //         }

    //     })
    // }, [identifier])
    return (
        <>
            <TableLookup identifier={identifier} openLookUp={openLookUp} tableLookUp={tableLookUp} setOpenLookUp={setOpenLookUp} />


            <div className="grid gap-2">

                <div className="grid grid-cols-3 gap-2">
                    <div className="grid gap-2 col-span-1 ">
                        <AccountsInputWrapper label={"Code"} value={getValue()?.code || ""} identifier={identifier || ""} property={'code'} isAccount={true}>

                            <div className="flex flex-col gap-2">

                                {isQc() && <p className="ml-1 text-green-900 font-bold">{getValueOcrVal()?.code || <span className="text-transparent">d</span>}</p>}
                                <div className="flex relative w-full">
                                    <>

                                        <Input onKeyDown={(e) => handleKeyPress(e, getTabIndex(1))} tabIndex={getTabIndex(0)} disabled={requesting || noData} className={cn(
                                            {
                                                " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${identifier}-code`),
                                            },
                                            "bg-transparent dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100"
                                        )} onChange={(e) => handleCodeChange(e)} id={identifier || "" + 'code'} placeholder="Code#" value={!noData ? getValue()?.code || "" : ""} />
                                        {renderErr(`${identifier}-code`) ? renderErr(`${identifier}-code`) : ""}

                                    </>
                                </div>
                            </div>
                        </AccountsInputWrapper>
                    </div>
                    <div className="grid gap-2 col-span-2">
                        <AccountsInputWrapper label={"Name"} value={getValue()?.name || ""} identifier={identifier || ""} property={'name'} isAccount={true}>

                            <div className="flex flex-col gap-2 w-full">
                                {isQc() && <p className="ml-1 text-green-900 font-bold">{getValueOcrVal()?.name || <span className="text-transparent">d</span>}</p>}
                                <div className={cn(isMisMatch(getValueOcrVal()?.name, getOriginalValue()?.name, getTabIndex(1)) ? "border border-red-600 rounded-md" : "", " flex relative  ")}>

                                    <Input onKeyDown={(e) => handleKeyPress(e, getTabIndex(2), "name", getValueOcrVal()?.name, getOriginalValue()?.name)} tabIndex={getTabIndex(1)} className={cn(
                                        {
                                            " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${identifier}-name`),
                                        },
                                        "bg-transparent dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100"
                                    )} autoComplete={"off"} disabled={requesting || noData}
                                        onChange={(e) => handleOnChange(e.target.value, "name")}
                                        id={identifier || "" + 'name'} placeholder="Name" value={!noData ? getValue()?.name || "" : ""} />
                                    {renderErr(`${identifier}-name`) ? renderErr(`${identifier}-name`) : ""}

                                </div>
                            </div>
                        </AccountsInputWrapper>
                    </div>
                </div>
                <div>
                    <AccountsInputWrapper label={"Address Line 1"} value={getValue()?.addressLine1 || ""} identifier={identifier || ""} property={'addressLine1'} isAccount={true}>
                        <div className="flex flex-col gap-2 w-full">
                            {isQc() && <p className="ml-1 text-green-900 font-bold">{getValueOcrVal()?.addressLine1}</p>}
                            {/* <div className="flex relative w-full"> */}
                            <div className={cn(isMisMatch(getValueOcrVal()?.addressLine1, getOriginalValue()?.addressLine1, getTabIndex(2)) ? "border border-red-600 rounded-md" : "", " flex relative w-full ")}>

                                <Input onKeyDown={(e) => handleKeyPress(e, getTabIndex(3), "addressLine1", getValueOcrVal()?.addressLine1, getOriginalValue()?.addressLine1)} tabIndex={getTabIndex(2)} className={cn(
                                    {
                                        " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${identifier}-addressLine1`),
                                    },
                                    "bg-transparent dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100"
                                )} disabled={requesting || noData}
                                    onChange={(e) => handleOnChange(e.target.value, "addressLine1")}
                                    id={identifier || "" + 'address-line1'} type="text" placeholder="Address Line 1" value={!noData ? getValue()?.addressLine1 || "" : ""} />
                                {renderErr(`${identifier}-addressLine1`) ? renderErr(`${identifier}-addressLine1`) : ""}

                            </div>
                        </div>
                    </AccountsInputWrapper>

                </div>
                <div>
                    <AccountsInputWrapper label={"Address Line 2"} value={getValue()?.addressLine2 || ""} identifier={identifier || ""} property={'addressLine2'} isAccount={true}>

                        <div className="flex flex-col gap-2 w-full">
                            {isQc() && <p className="ml-1 text-green-900 font-bold">{getValueOcrVal()?.addressLine2}</p>}
                            {/* <div className="flex relative w-full"> */}
                            <div className={cn(isMisMatch(getValueOcrVal()?.addressLine2, getOriginalValue()?.addressLine2, getTabIndex(3)) ? "border border-red-600 rounded-md" : "", " flex relati w-full  ")}>
                                <Input onKeyDown={(e) => handleKeyPress(e, getTabIndex(4), "addressLine2", getValueOcrVal()?.addressLine2, getOriginalValue()?.addressLine2)} tabIndex={getTabIndex(3)} className={cn(
                                    {
                                        " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${identifier}-addressLine2`),
                                    },
                                    "bg-transparent dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100"
                                )} disabled={requesting || noData}
                                    //onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "addressLine2", }))}
                                    onChange={(e) => handleOnChange(e.target.value, "addressLine2")}
                                    id={identifier || "" + 'address-line2'} type="text" placeholder="Address Line 2" value={!noData ? getValue()?.addressLine2 || "" : ""} />

                                {renderErr(`${identifier}-addressLine2`) ? renderErr(`${identifier}-addressLine2`) : ""}
                            </div>
                        </div>
                    </AccountsInputWrapper>

                </div>
                <div className="grid grid-cols-3 gap-2">
                    <AccountsInputWrapper label={"City"} value={getValue()?.city || ""} identifier={identifier || ""} property={'city'} isAccount={true}>
                        <div className="flex flex-col gap-2 w-full">
                            {isQc() && <p className="ml-1 text-green-900 font-bold">{getValueOcrVal()?.city || <span className="text-transparent">d</span>}</p>}
                            {/* <div className="flex relative w-full"> */}
                            <div className={cn(isMisMatch(getValueOcrVal()?.city, getOriginalValue()?.city, getTabIndex(4)) ? "border border-red-600 rounded-md" : "", " flex relative w-full  ")}>
                                <Input onKeyDown={(e) => handleKeyPress(e, getTabIndex(5), "city", getValueOcrVal()?.city, getOriginalValue()?.city)} tabIndex={getTabIndex(4)} disabled={requesting || noData} className={cn(
                                    {
                                        " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${identifier}-city`),
                                    },
                                    "bg-transparent dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100"
                                )} placeholder="City" value={!noData ? getValue()?.city || "" : ""}
                                    // onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "city", }))}
                                    onChange={(e) => handleOnChange(e.target.value, "city")}
                                />

                                {renderErr(`${identifier}-city`) ? renderErr(`${identifier}-city`) : ""}
                            </div>
                        </div>
                    </AccountsInputWrapper>

                    <AccountsInputWrapper label={"State"} value={getValue()?.state || ""} identifier={identifier || ""} property={'state'} isAccount={true}>
                        <div className="flex flex-col gap-2 w-full">
                            {isQc() && <p className="ml-1 text-green-900 font-bold">{getValueOcrVal()?.state || <span className="text-transparent">d</span>}</p>}
                            {/* <div className="flex relative w-full"> */}
                            <div className={cn(isMisMatch(getValueOcrVal()?.state, getOriginalValue()?.state, getTabIndex(5)) ? "border border-red-600 rounded-md" : "", " flex relative w-full  ")}>
                                <Input onKeyDown={(e) => handleKeyPress(e, getTabIndex(6), "state", getValueOcrVal()?.state, getOriginalValue()?.state)} tabIndex={getTabIndex(5)} disabled={requesting || noData} className={cn(
                                    {
                                        " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${identifier}-state`),
                                    },
                                    "bg-transparent dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100"
                                )} placeholder="State" value={!noData ? getValue()?.state || "" : ""}
                                    // onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "state", }))}
                                    onChange={(e) => handleOnChange(e.target.value, "state")}
                                />

                                {renderErr(`${identifier}-state`) ? renderErr(`${identifier}-state`) : ""}
                            </div>
                        </div>
                    </AccountsInputWrapper>

                    <AccountsInputWrapper label={"Zipcode"} value={getValue()?.zipCode || ""} identifier={identifier || ""} property={'zipCode'} isAccount={true}>
                        <div className="flex flex-col gap-2 w-full">
                            {isQc() && <p className="ml-1 text-green-900 font-bold">{getValueOcrVal()?.zipCode || <span className="text-transparent">d</span>}</p>}
                            {/* <div className="flex relative"> */}
                            <div className={cn(isMisMatch(getValueOcrVal()?.zipCode, getOriginalValue()?.zipCode, getTabIndex(6)) ? "border border-red-600 rounded-md" : "", " flex relative  ")}>
                                <Input onKeyDown={(e) => handleKeyPress(e, getTabIndex(7), "zipCode", getValueOcrVal()?.zipCode, getOriginalValue()?.zipCode)} tabIndex={getTabIndex(6)} disabled={requesting || noData} className={cn(
                                    {
                                        " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${identifier}-zipCode`),
                                    },
                                    "bg-transparent  dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100"
                                )} id={identifier || "" + 'zip'} placeholder="ZipCode" value={!noData ? getValue()?.zipCode || "" : ""}
                                    //onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "zipCode", }))}
                                    onChange={(e) => handleOnChange(e.target.value, "zipCode")}
                                />

                                {renderErr(`${identifier}-zipCode`) ? renderErr(`${identifier}-zipCode`) : ""}
                            </div>
                        </div>
                    </AccountsInputWrapper>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                        <AccountsInputWrapper label={"Phone"} value={getValue()?.phone || ""} identifier={identifier || ""} property={'phone'} isAccount={true}>
                            <div className="flex flex-col gap-2 w-full">
                                {isQc() && <p className="ml-1 text-green-900 font-bold">{getValueOcrVal()?.phone || <span className="text-transparent">d</span>}</p>}
                                {/* <div className="flex relative w-full"> */}
                                <div className={cn(isMisMatch(getValueOcrVal()?.phone, getOriginalValue()?.phone, getTabIndex(7)) ? "border border-red-600 rounded-md" : "", " flex relative w-full  ")}>
                                    <Input onKeyDown={(e) => handleKeyPress(e, getTabIndex(8), "phone", getValueOcrVal()?.phone, getOriginalValue()?.phone)} tabIndex={getTabIndex(7)} className={cn(
                                        {
                                            " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${identifier}-phone`),
                                        },
                                        "bg-transparent dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100"
                                    )} disabled={requesting || noData} id={identifier || "" + 'contact-number'} placeholder="Phone#" value={!noData ? getValue()?.phone || "" : ""}
                                        //  onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "phone", }))}
                                        onChange={(e) => handleOnChange(e.target.value, "phone")}
                                    />

                                    {renderErr(`${identifier}-phone`) ? renderErr(`${identifier}-phone`) : ""}

                                </div>
                            </div>
                        </AccountsInputWrapper>
                    </div>
                    <div className="grid gap-2">
                        <AccountsInputWrapper label={"Contact Name"} value={getValue()?.contactName || ""} identifier={identifier || ""} property={'contactName'} isAccount={true}>
                            <div className="flex flex-col gap-2 w-full">
                                {isQc() && <p className="ml-1 text-green-900 font-bold">{getValueOcrVal()?.contactName || <span className="text-transparent">d</span>}</p>}
                                {/* <div className="flex relative w-full"> */}
                                <div className={cn(isMisMatch(getValueOcrVal()?.contactName, getOriginalValue()?.contactName, getTabIndex(8)) ? "border border-red-600 rounded-md" : "", " flex relative w-full  ")}>
                                    <Input tabIndex={getTabIndex(8)} onKeyDown={(e) => handleKeyPress(e, getTabIndex(8), "contactName", getValueOcrVal()?.contactName, getOriginalValue()?.contactName)} className={cn(
                                        {
                                            " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${identifier}-contactName`),
                                        },
                                        "bg-transparent dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100"
                                    )} disabled={requesting || noData} id={identifier || "" + 'contact-name'} placeholder="Contact Name" value={!noData ? getValue()?.contactName || "" : ""}
                                        // onChange={(e) => dispatch(changeBillingInfoData({ newValue: e.target.value, parent_property: identifier, child_property: "contactName", }))} />
                                        onChange={(e) => handleOnChange(e.target.value, "contactName")} />
                                    {renderErr(`${identifier}-contactName`) ? renderErr(`${identifier}-contactName`) : ""}

                                </div>
                            </div>
                        </AccountsInputWrapper>
                    </div>
                </div>
            </div>
        </>

    )
}