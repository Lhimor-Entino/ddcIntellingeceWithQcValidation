import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { BinaryIcon, CaseLowerIcon, ClipboardEditIcon, SpaceIcon, UndoDotIcon, WholeWordIcon } from "lucide-react"
import { ReactNode } from "react"
import useShortCutActions from "@/hooks/shorcutActions";
import { useSelector } from "react-redux";
import { selectData } from "@/reducers/originalRequestDataSelector";
interface Props {
    children: ReactNode;
    label: string;
    value: string;
    property?: string;
    identifier: string;
    isItem?: boolean;
    isAccount?: boolean;
    itemIndex?: number
    isInstruction?: boolean
    instructions?:any
}

const AccountsInputWrapper = (props: Props) => {
    const { children, label,
        value,
        property, identifier, isItem,
        isAccount, itemIndex, isInstruction } = props
    const {revertToOriginal,removeAlpha, removeAllSpaces, removeMultipleSpaces, removeSpecialChars, removeNumericCharacters } = useShortCutActions()
  
    const data = useSelector((state) =>
        selectData(state,{ property:identifier, child_property:property, index:itemIndex,isInstruction })
      );
      
    
  
 
    return (
        <ContextMenu>
       
            <ContextMenuTrigger className="flex  items-center justify-center rounded-md  text-sm">
                {children}
         
            </ContextMenuTrigger>
            <ContextMenuContent className="w-fit shadow-lg shadow-slate-500 relative">
                <ContextMenuLabel className="text-red-600  font-bold rounded-md mb-2">{label} Actions</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => removeAlpha(value, identifier, isAccount, property, isItem, itemIndex, isInstruction)} className=" flex  items-center hover:cursor-pointer" >
                    <CaseLowerIcon className="w-5 h-5 mr-3" />
                    Remove Apla Characters 
                </ContextMenuItem>
                <ContextMenuItem onClick={() => removeSpecialChars(value, identifier, isAccount, property, isItem, itemIndex, isInstruction)} className=" flex  items-center hover:cursor-pointer " >
                    <ClipboardEditIcon className="w-4 h-4 mr-3" />
                    Remove Special Characters
                </ContextMenuItem>
                <ContextMenuItem onClick={() => removeMultipleSpaces(value, identifier, isAccount, property, isItem, itemIndex, isInstruction)} className=" flex  items-center hover:cursor-pointer" >
                    <WholeWordIcon className="w-5 h-5 mr-3" />
                    Remove Multiple Spaces
                </ContextMenuItem>

                <ContextMenuItem onClick={() => removeAllSpaces(value, identifier, isAccount, property, isItem, itemIndex, isInstruction)} className=" flex  items-center hover:cursor-pointer" >
                    <SpaceIcon className="w-5 h-5 mr-3" />
                    Remove All Space
                </ContextMenuItem>


                <ContextMenuItem onClick={() => removeNumericCharacters(value, identifier, isAccount, property, isItem, itemIndex, isInstruction)} className=" flex  items-center hover:cursor-pointer" >
                    <BinaryIcon className="w-5 h-5 mr-3" />
                    Remove Numeric Characters
                </ContextMenuItem>
                <ContextMenuItem  onClick={() =>revertToOriginal(data || "", identifier, isAccount, property, isItem, itemIndex, isInstruction)} className=" flex  items-center hover:cursor-pointer" >
                    <UndoDotIcon className="w-5 h-5 mr-3" />
                    Revert to original 
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default AccountsInputWrapper