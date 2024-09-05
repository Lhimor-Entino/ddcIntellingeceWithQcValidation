
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { AxiosInstance } from "axios"
import { FormEventHandler, useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { coookie_options } from "@/config"
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react"
import logo from "@/assets/img/ddc_connect3_dark_red.png"
import logo_light from "@/assets/img/ddc_connect3.png"
import { toast } from "sonner"
interface Props {
    api: AxiosInstance,
}

const Login = (props: Props) => {
    const { api } = props
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false);
   // const [savingCredentials,setSavingCredentials] = useState<boolean>(false)
    const navigate = useNavigate();

    const accepted_role = ["ROLE_QC", "ROLE_VERIFIER"];

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true)

        const user = {
            "username": username,
            "password": password
        }
        try {
            const response = await api.post(
                "/credential/login",
                user
            );

            if (response.data.details.token) {

                if(!accepted_role.includes(response.data.details.authorities[0]) ){
                    toast.error("Access denied, user role restricted.")
                    return
                }
                Cookies.set("jt", response.data.details.token, coookie_options);

                // ENSURE THAT COOKIE IS CREATED BEFORE IT PROCEED
                
                for (let i = 0; i <= 10; i++){
                    console.log("saving credentials")
                    Cookies.set("jt", response.data.details.token, coookie_options);
                }
                if(!Cookies.get("jt")){
                    toast.error("Alert", {
                        description: 'Failed to save credentials',
                        duration:2000
                      });
                      window.location.reload();
                }
                Cookies.set("user",user.username,coookie_options)
                Cookies.set("role",response.data.details.authorities[0],coookie_options)
                Cookies.set("client", response.data.details.clients[0], coookie_options)
                Cookies.set("auto_request", "true", coookie_options)
                navigate("/")
            }

        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.details, {
                description: `${error.response.data.message}.`,
                duration: 5000
            })
        } finally {
            setLoading(false)
        }

    }



    useEffect(() => {
        if (Cookies.get("jt")) {
            navigate("/")
            return
        };
    }, [])


    return (
        <div
            className={cn(
                {
                    'cursor-wait': loading,
                },
                'flex items-center justify-center h-screen'
            )}>
              
            <Card className="w-[350px] ">

                <CardHeader className="relative">
                    {/* <img src={logo}/> */}
                    <img src={logo} className="w-full  rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <img src={logo_light} className="w-5/6 absolute m-auto rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your username below to login to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="login" onSubmit={onSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Username</Label>
                                <Input autoFocus id="name" placeholder="Username" autoComplete="nofill" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Password</Label>
                                <div className="relative">
                                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    {
                                        !showPassword ? <EyeIcon onClick={() => setShowPassword(!showPassword)} className="absolute top-2 right-2  hover:cursor-pointer" />
                                            : <EyeOffIcon onClick={() => setShowPassword(!showPassword)} className="absolute top-2 right-2 hover:cursor-pointer" />
                                    }

                                </div>


                            </div>

                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex">


                    <Button disabled={username.length > 0 && password.length > 0 ? false : true} form="login" className="w-full bg-red-900 hover:bg-red-900 dark:text-white" type="submit"> {loading ? <div className="flex items-center"><Loader2Icon color={"#fff"} className="w-4 h-4 animate-spin mr-2" /> <span className={cn(loading ? "animate-pulse" : '')}> Logging In ... </span></div> : "Login"}</Button>



                </CardFooter>
            </Card>
        </div>

    )
}

export default Login