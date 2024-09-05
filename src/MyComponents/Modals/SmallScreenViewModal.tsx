import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,

    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FullscreenIcon } from "lucide-react";

export const SmallScreenViewModal = () => {
    const enterFullscreen = () => {
        document.documentElement.requestFullscreen();
      };
    return (
        <div className="absolute w-full h-screen bg-slate-950  flex items-center justify-center" style={{zIndex:60}}>
            <Card className="w-fit">
                <CardHeader>
                    <CardTitle>SCREEN NOT WIDE ENOUGH</CardTitle>
                   
                </CardHeader>
                
                <CardContent>
                <Separator />
                <p className="mt-3">MAKE SURE YOUR DEVICE IS AT LEAST 1464PX WIDE,</p>
               <p>TO FULLY UTILISE THE MISSION EXPERIENCE!</p> 
                </CardContent>
                <CardFooter className="flex justify-end " onClick={() => enterFullscreen()}>
                    <Button className="flex w-full">
                        <FullscreenIcon className="mr-2" />
                        <p>Enter Full Screen</p>
                    </Button>
                    
                </CardFooter>
            </Card>
        </div>
    )
}
