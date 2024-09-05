
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



interface Props {
  handleRequestEntry: () => void;
  errMsg: ErrMsg;
  setRequestFailed: any;
  errorOn: number; // 1 is saving else is on request
}
const FailedRequestAlertModal = (props: Props) => {
  const { handleRequestEntry, errMsg, setRequestFailed, errorOn } = props
  const tokenErr = "The JWT signature is invalid"
  return (
    <AlertDialog open>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> {errMsg.details ? errMsg.details : "Can't connect to server."}</AlertDialogTitle>
          <AlertDialogDescription className="w-fit">
            {errMsg.message ? errMsg.message : " Please try your request again later. "}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>

          <AlertDialogCancel onClick={() => setRequestFailed(false)}>{errorOn === 1 || errMsg.message === tokenErr ? "Close" : "Cancel"}</AlertDialogCancel>
          {
            errMsg.message !== tokenErr && <AlertDialogAction autoFocus={true} onClick={() => handleRequestEntry()}>Request</AlertDialogAction>
          }

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default FailedRequestAlertModal