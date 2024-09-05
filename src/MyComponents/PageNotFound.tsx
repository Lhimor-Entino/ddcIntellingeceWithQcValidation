import { TriangleAlertIcon } from 'lucide-react'

import logo from "@/assets/img/ddc_connect3_dark_red.png"
import logo_light from "@/assets/img/ddc_connect3.png"

const PageNotFound = () => {
    return (
        <div className='overflow-hidden'>

            <div className='flex m-auto flex-col items-center my-4 w-fit p-10 rounded-md '>

                <TriangleAlertIcon className='w-10 h-10 animate-bounce ' />
                <p className=' font-extrabold mt-3'>404 Page not found</p>
            </div>
            <div className='w-96 m-auto mt-3'>
                <img src={logo} className="w-full  h-20 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <img src={logo_light} className="w-full absolute h-20 top-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
            </div>
        </div>

    )
}

export default PageNotFound