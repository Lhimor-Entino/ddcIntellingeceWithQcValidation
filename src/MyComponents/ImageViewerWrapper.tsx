import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Label } from "@/components/ui/label"
import { APP_DOMAIN, coookie_options } from "@/config"
import { toggleImageViewer } from "@/reducers/viewReducers"
import Cookies from "js-cookie"
import { PanelTopIcon } from "lucide-react"
import { ReactNode } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"

interface Props {
    children: ReactNode
    img: string
}




const ImageViewerWrapper = (props: Props) => {
    const { children, img } = props
    const dispatch = useDispatch()


    const openNewTab = () => {
        const parts = img.split('/');
        const img_ = parts[parts.length - 1];

        try {
            window.open(`${APP_DOMAIN}/ddcIntelligence/tabViewer/${img_}`, '_blank');
            dispatch(toggleImageViewer())
            Cookies.set("openInOtherTab","1",coookie_options)
        } catch (error) {
            toast.error("Action Error")
            console.log(error)
        }

    };

    return (
        <ContextMenu>
            <ContextMenuTrigger >
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64 shadow-inset shadow-red-400">
                <Label className="ml-2 py-2 text-red-800 font-bold">Image Viewer Actions</Label>
               
               <ContextMenuSeparator />
                <ContextMenuItem className="mt-4" onClick={() => openNewTab()}>
              
                    <PanelTopIcon className="w-4 h-4 mr-2" /> Send to another tab
                    <ContextMenuShortcut>⌘</ContextMenuShortcut>
                </ContextMenuItem>

            </ContextMenuContent>
        </ContextMenu>
    )
}

export default ImageViewerWrapper