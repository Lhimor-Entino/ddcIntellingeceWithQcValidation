
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import useAuthValidatorAlerts from "@/hooks/authValidatorAlerts";
import { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { CircleHelpIcon, Loader2Icon } from "lucide-react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface Props {
    loggingOut: boolean;
    setLoggingOut: (arg: boolean) => void;
    api: AxiosInstance
    filename?: string
}

const LogoutModal = (props: Props) => {
    const { loggingOut, setLoggingOut, api, filename } = props
    const { tokenExpired } = useAuthValidatorAlerts();
    const [loading,setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const deallocate = async () => {
        const token = Cookies.get("jt")
        setLoading(true)
        try {
            const response = await api.get(`document/unlock/${filename}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.data.status == "200" ) {
                Cookies.remove("jt")
                Cookies.remove("image_expiration")
                Cookies.remove("img_urls")
                Cookies.remove("original_request_data")
                Cookies.remove("request_ocr_json")
                Cookies.remove("request_info")
                Cookies.remove("request_json")
                Cookies.remove("user")
                Cookies.remove("role")
                Cookies.remove("client")
                Cookies.remove("request_ts")
                Cookies.remove("tabIndex")
                setLoggingOut(false)
                navigate("login")
            }
            console.log(response)
        } catch (error: any) {
            console.log(error)
            if (error.response.data.status == "403") {
                tokenExpired()
            }
            if (error.response.data.status =="400") {
                Cookies.remove("jt")
                Cookies.remove("image_expiration")
                Cookies.remove("img_urls")
                Cookies.remove("original_request_data")
                Cookies.remove("request_ocr_json")
                Cookies.remove("request_info")
                Cookies.remove("request_json")
                Cookies.remove("user")
                Cookies.remove("role")
                Cookies.remove("client")
                Cookies.remove("request_ts")
                Cookies.remove("tabIndex")
                setLoggingOut(false)
                navigate("login")
            }
        }finally{
            setLoading(false)
        }
    }
    return (
        <Dialog open={loggingOut} onOpenChange={() => setLoggingOut(!loggingOut)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">Logout <CircleHelpIcon className="animate-spin-y-5 w-5 h-5" /></DialogTitle>
                    <DialogDescription>

                        Note : You have a pending request. This request will be deallocated.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button type="button" size={"sm"} onClick={() => deallocate()}> {loading && <Loader2Icon className="animate-spin w-4 h-4 mr-3"/>  }Logout</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LogoutModal