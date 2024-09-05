import Cookies from "js-cookie";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";
const useAuthValidatorAlerts = () => {
    const navigate = useNavigate()
    const tokenExpired = () => {

        toast.info('Your session has expired.', {
            description: 'You will be automatically logged out. Please log in again to continue.',
            duration: 5000
        },

        )
        setTimeout(() => {
            Cookies.remove("jt")
            Cookies.remove("img_urls")
            Cookies.remove("request_info")
            Cookies.remove("request_json")
            Cookies.remove("original_request_data")
            navigate("login")
        }, 5000);

    }

    return {
        tokenExpired
    }

}

export default useAuthValidatorAlerts