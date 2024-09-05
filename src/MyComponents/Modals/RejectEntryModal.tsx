
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CircleXIcon } from "lucide-react"
import { useState } from "react"
interface Props {
    reject: (arg:string) => void;
    showRejectModal: boolean;
    setShowRejectModal: (arg: boolean) => void;
}

const RejectEntryModal = (props: Props) => {
    const { reject, showRejectModal, setShowRejectModal } = props
    const [reason,setReason] = useState<string>("")

    const handleReject = () => {
        reject(reason)
        setReason("")
        setShowRejectModal(false)
    }
    return (
        <Dialog open={showRejectModal} onOpenChange={() => setShowRejectModal(!showRejectModal)}>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reject Entry ?</DialogTitle>
                    <DialogDescription>
                        Please select one of the rejection reasons listed below.
                    </DialogDescription>
                </DialogHeader>
                <div  className="flex justify-center">
                <Select onValueChange={(e)=>setReason(e)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectGroup>
                            <SelectLabel>Reasons</SelectLabel>
                            <SelectItem value="BLANK OCR">BLANK OCR</SelectItem>
                            <SelectItem value="BLANK IMAGE">BLANK IMAGE</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                </div>
          
                <DialogFooter className="mt-3">
                    <Button disabled={reason.length < 1 ? true :false} type="button" className="bg-red-800" onClick={() => handleReject()}>
                        <CircleXIcon className="w-4 h-4 mr-1 flex flex-col items-center" />
                               Reject
                        </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RejectEntryModal