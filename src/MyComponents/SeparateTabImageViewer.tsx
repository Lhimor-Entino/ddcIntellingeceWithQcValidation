
import ImageViewer from "@/MyComponents/ImageViewer"
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ShieldXIcon } from 'lucide-react';
import logo from "@/assets/img/ddc_connect3_dark_red.png"
import logo_light from "@/assets/img/ddc_connect3.png"
import { APP_DOMAIN } from "@/config";
import { useEffect, useState } from "react";


const SeparateTabImageViewer = () => {

    const { img } = useParams();
    const [urls,setUrls] = useState<string>(img || "")

    useEffect(()=>{
        if(Cookies.get("img_urls")){
            
            const  iu = JSON.parse(Cookies.get("img_urls") || "")
            const parts = iu.newValue[0].split('/');
            const img_ = parts[parts.length - 1];
            console.log(img_);
        }
    },[])

    useEffect(() => {
        const interval = setInterval(() => {
            if(Cookies.get("img_urls")){
                const  iu = JSON.parse(Cookies.get("img_urls") || "")
                const parts = iu.newValue[0].split('/');
                const img_ = parts[parts.length - 1];
                console.log(img_);
                setUrls(img_);
            }
        }, 2000);
    
        // Cleanup function
        return () => clearInterval(interval);
      }, []);

    return (
        <>
            {
                Cookies.get("jt") ? <div className=" flex justify-center w-4/5 h-96 m-auto">
                    <div className="relative z-10 w-full h-96  mb-20 border-2 flex">         
                        {urls ? <ImageViewer image={`blob:${APP_DOMAIN}/${urls}`}
                            alt="temp.jpg" /> : <img
                            src="https://ui.shadcn.com/placeholder.svg"
                            alt="Image"
                            // width="1920"
                            // height="1080"
                            className={
                                "h-full w-full object-cover dark:brightness-[0.1] dark:grayscale"
                            }
                        />}             
                    </div>
                </div> :
                    <>
                        <div className=' bg-red-400 p-10 rounded-md w-fit m-auto flex flex-col items-center mt-52'>
                            <ShieldXIcon className='w-10 h-10' />
                            <p className='font-extrabold text-lg'>Access Denied</p>
                        </div>
                        <div className='w-96 m-auto mt-3'>
                            <img src={logo} className="w-full  h-20 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <img src={logo_light} className="w-full absolute h-20 top-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
                        </div>
                    </>
            }
        </>
    )
}

export default SeparateTabImageViewer