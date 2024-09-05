import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2Icon } from "lucide-react"

interface Props{
    message: string
  }

export const StatusModal = (props: Props) => {
    const {message} = props
  return (
    <div  className="h-screen w-full absolute z-50  hover:cursor-not-allowed"> 
        <Alert style={{width: "20%", left: "40%"}}  className="  top-6 bg-red-800 text-white dark:bg-white dark:text-slate-950 animate-bounce transition duration-5000 ">
            <Loader2Icon color="#fff" className="h-5 w-5 animate-spin dark:bg-red-900 rounded-xl" />
            <AlertTitle> {message}</AlertTitle>
            <AlertDescription>
            Please wait . . .
            </AlertDescription>
         </Alert> 
    </div>
  
  )
}
