import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

  } from "@/components/ui/alert-dialog"
  import { ErrMsg } from "@/Mytypes";
  interface Props{
    handleRequestEntry: () => void;
    errMsg:ErrMsg;
    setRequestFailed:any;
  }
export const NoMoreDataAvailable = (props:Props) => {
    const {handleRequestEntry,errMsg,setRequestFailed} = props
  return (
  <AlertDialog open>
       
        <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle> {errMsg.details} {errMsg.message}.</AlertDialogTitle>
            <AlertDialogDescription className="w-fit">
                Please try your request again later.
                <br>
                </br>
                Thank you.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=> setRequestFailed(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction autoFocus={true} onClick={() => handleRequestEntry()}>Request</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}
