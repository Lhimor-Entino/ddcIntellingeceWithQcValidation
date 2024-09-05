import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Button } from "@/components/ui/button"


import { CircleHelpIcon, RefreshCcwIcon } from "lucide-react"
import { useState } from "react";


interface Props  {
    setReload : (arg:boolean) => void;
    
    
}

const ReloadPageConfirmationModal = (props: Props) => {
    const {setReload} = props
    const [loading,setLoading] = useState<boolean>(false)

    const handleReload = () => {
        // setReload(false)
        setLoading(true)
        window.location.reload()

    }

    const handleCancel = () => {
        setReload(false)
    }


    return (
        <div className={"h-screen w-full absolute z-50  hover:cursor-not-allowed"}>
            <Alert style={{ width: "20%", left: "40%" }} className="  top-6 bg-red-800 text-white dark:bg-white dark:text-slate-950 ">
                {loading ? <RefreshCcwIcon color="#fff" className="h-5 w-5 animate-spin dark:bg-red-900 rounded-xl"/>  :   <CircleHelpIcon color="#fff" className="h-5 w-5  dark:bg-red-900 rounded-xl animate-bounce" /> }
                
             
                <AlertTitle>{loading ? "Reloading page" : "Are you sure you want to reload the page?"}</AlertTitle>
                <AlertDescription>
                    <p className="mt-3">You're progress will not be save.</p>
                    
                    <div className="flex mt-3 justify-end">
                    <Button onClick={() => handleCancel()} variant="outline" size={"sm"} className=" h-fit pb-1 pt-[0.8px] bg-trasparent hover:bg-transparent hover:text-white dark:hover:text-slate-900">Cancel</Button>
                    <Button onClick={() => handleReload()} size={"sm"}  className=" h-fit pt-1 pb-1 ml-5 dark:bg-slate-900 dark:text-white bg-white text-red-950 hover:bg-white">Reload</Button>
                    </div>
                    
                </AlertDescription>
              
            </Alert>
        </div>
    )
}

export default ReloadPageConfirmationModal