
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { changeOtherData } from "@/reducers/requestReducer";
// import { useEffect, useState } from "react";
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

import { CircleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import AccountsInputWrapper from "./AccountsInputWrapper";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { addIndex } from "@/reducers/TabIndex";
import { coookie_options } from "@/config";
interface Props {
    label: string;
    value: string;
    property: string;
    disable?: boolean;
    pos: number,
    ocr_data: string;
    original_data: string
}
export const BillingInput = (props: Props) => {
    const { label, value, property, disable, pos, ocr_data, original_data } = props
    //const {removeNumericCharacters, removeAlpha, removeAllSpaces, removeMultipleSpaces, removeSpecialChars } = useShortCutActions()
    //const request_data = useSelector((state: any) => state.request_reducer);
    const validation_data = useSelector((state: any) => state.validation_Reducer);
    const [pressedKey, setPressedKey] = useState<any>(null)
    const original_data_req = useSelector((state: any) => state.original_request_reducer);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useDispatch()

    // const [noData, setNoData] = useState<boolean>(false)
    // useEffect(() => {
    //     if (JSON.stringify(request_data.request_json) !== "{}") {
    //         setNoData(false)
    //     } else {
    //         setNoData(true)
    //     }

    // }, [request_data])

    useEffect(() => {
        if(inputRef.current){
            inputRef.current.style.backgroundColor= "transparent"
        }
        inputRef.current = null
    },[original_data_req])
    const renderErr = (property: string) => {

        const existingError = validation_data.errors.find((error: any) => error.property === property);

        if (!existingError) return null;
        if (existingError?.newValue.length < 1) return null;
        return (

            <Popover>
                <PopoverTrigger>
                    <CircleAlertIcon className=" hover:cursor-pointer absolute w-3 h-3 right-1  text-red-800" style={{ top: "15%" }} />
                </PopoverTrigger>
                <PopoverContent>
                    <Command className="rounded-lg bg-red-200  ">

                        <CommandList>

                            <CommandGroup heading={<p className="font-extrabold text-md uppercase">{property} Error/s</p>}>

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

    // Function to handle key press events
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, tabIndex: number) => {

        const nextTab = tabIndex + 1
   
  
        if (e.altKey && e.key === "1") {
           
            e.preventDefault()
            if (Cookies.get("role") !== "ROLE_QC") return
            setPressedKey(1)
            dispatch(changeOtherData({ newValue: ocr_data, property }))
            inputRef.current = e.currentTarget;
            if (inputRef.current) {
                inputRef.current.style.backgroundColor = "#50B498"
             }
            return
        }
        if (e.altKey && e.key === "2") {
            
            e.preventDefault()

            if (Cookies.get("role") !== "ROLE_QC") return
            setPressedKey(2)
            dispatch(changeOtherData({ newValue: original_data, property }))
            inputRef.current = e.currentTarget;
            if (inputRef.current) {
                inputRef.current.style.backgroundColor = "transparent"
             }
            return
        }
        if (e.altKey && e.key === "3") {
           
            e.preventDefault()
      

            if (Cookies.get("role") !== "ROLE_QC") return
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

            return
        }

        if (e.key === 'Enter') {

            e.preventDefault(); // Prevent the default Enter behavior
            if (tabIndex !== null) {

                // Find the next input element based on tabIndex
                const nextInput = document.querySelector(`input[tabIndex="${nextTab}"]`) as HTMLInputElement;

                if (nextInput) {
                    console.log(nextInput)
                    nextInput.focus(); // Focus on the next input
                }
            }
        }
    };

    const hanleOnChange = (value: string) => {

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

                dispatch(changeOtherData({ newValue: value, property }))



                return
            }
            return
        }

        dispatch(changeOtherData({ newValue: value, property }))
    }

    // const onBlur = () => {

    //     if (inputRef.current) {
    //         inputRef.current.style.backgroundColor = "transparent"
    //     }


    // }

    const isMisMatch = () => {
        if(value === undefined && ocr_data === null || value === null && ocr_data === undefined ) {
            return false
        } 
        if(value !== ocr_data){
            return true
        }

      
    }
    useEffect(()=> {

        if(isMisMatch()){
            console.log("value : ",value, "ocr : " ,ocr_data)
            if(pos === 0) return
            let indexes :any = []
            if(!Cookies.get("tabIndex")){

                indexes = [pos]
                Cookies.set("tabIndex",JSON.stringify(indexes),coookie_options)
                const focusableElements = 'input';
                const elements = Array.from(document.querySelectorAll(focusableElements)) as HTMLElement[];

                
                elements[pos].focus()
                console.log(elements[pos])
                // elements[pos].style.border = "3px solid #9A031E"
                return
            } 
        
            indexes = JSON.parse(Cookies.get("tabIndex") || "")
            indexes.push(pos)
            Cookies.set("tabIndex",JSON.stringify(indexes),coookie_options)
           // dispatch(addIndex({newValue : pos}))
        }
       
    },[value,ocr_data])
    return (
        <div className="w-full">

            <Label className="text-red-800 dark:text-white">{label}
                {Cookies.get("role") === "ROLE_QC" && <span className="ml-5 text-green-900 font-bold" >{ocr_data}</span>}
            </Label>
            {
                Cookies.get("role") === "ROLE_QC" &&
                <div className="flex gap-5 mt-3 mb-3 pl-1">
                    {/* <div className="flex">
                        <Label className="text-xs">
                            <span className="font-extrabold">1)</span> OCR Data :
                        </Label>
                        <p className="text-xs">&nbsp; {value}</p>
                    </div>
                    <div className="flex">
                        <Label className="text-xs">
                            <span className="font-extrabold">2)</span>  Verified Data :
                        </Label>
                        <p className="text-xs">&nbsp; {value}</p>
                    </div> */}

                </div>
            }

            {/* {noData
                ?
                <Input className="mt-1" disabled={true} value={""} onChange={() => { }} />
                : */}
            <AccountsInputWrapper label={label} value={value || ""} identifier={property || ""} isAccount={false}>
                <div className= { cn(isMisMatch() && !disable ? "border border-red-600 rounded-md": "" ,"relative flex w-full p-0") }>
                    <Input onKeyDown={(e) => handleKeyPress(e, pos)} tabIndex={pos} id={`${property}`} 
                    className={cn(renderErr(`${property}`) ?
                        "shadow-sm shadow-red-500 text-red-700 font-semibold" :
                        "",
                        " focus-visible:ring-offset-0 focus-visible:ring-0 focus:bg-blue-100 dark:focus:bg-slate-800 "

                    )} disabled={disable ? disable : false} value={value || ""} onChange={(e) => hanleOnChange(e.target.value)} />
                    {renderErr(property)}

                </div>
            </AccountsInputWrapper>
            {/* } */}

        </div>
    )
}
