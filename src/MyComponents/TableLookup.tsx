import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { BookOpenCheckIcon, CircleCheckBigIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { TableLookUp } from "@/Mytypes"
import { useState } from "react"
import useTableLookUp from "@/hooks/tableLookUp"
interface Props {
    identifier?: string;
    openLookUp: boolean;
    setOpenLookUp: (arg: boolean) => void;
    tableLookUp: TableLookUp[]
}

const TableLookup = (props: Props) => {
    const { identifier, openLookUp, tableLookUp, setOpenLookUp } = props
    const [selectedLookup, setSelectedLookup] = useState<number>(.01)
    const { applyTableLookUp } = useTableLookUp()

    const handleSelect = (selected: TableLookUp, index: number) => {
        applyTableLookUp(selected, identifier || "")
        setSelectedLookup(index)
        setOpenLookUp(false)
    }
    return (
        <Sheet open={openLookUp} onOpenChange={() => setOpenLookUp(!openLookUp)}>

            <SheetContent onInteractOutside={(e) => {
                e.preventDefault();
            }} side={"bottom"} className="h-auto " >
                <SheetHeader>
                    <SheetTitle className="uppercase flex items-center"><BookOpenCheckIcon className="mr-2 w-5 h-5" />{identifier} table lookup</SheetTitle>
                    <SheetDescription>
                        List of table lookup ({tableLookUp.length})

                    </SheetDescription>
                </SheetHeader>
                <div className="grid w-full grid-flow-col gap-3 overflow-auto">

                    {
                        tableLookUp.map((tl, index: number) => (
                            <Card tabIndex={index + 1} className={cn(selectedLookup === index ? "shadow-inner shadow-green-700" : "", "w-[350px] mt-2  ")} key={index}>

                                <CardContent className="mt-3">
                                    <div className="flex justify-end items-center  ">
                                        <p className="mr-2">{index + 1}</p>
                                        <CircleCheckBigIcon onClick={() => handleSelect(tl, index)} className={cn(selectedLookup === index ? " text-green-700" : "", " hover:animate-pulse hover:cursor-pointer w-5 h-5")} />
                                    </div>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="name" className="font-bold text-red-800">Name</Label>
                                            <Input id={`${index}-name`} className="focus-visible:ring-offset-0 focus-visible:ring-0" value={tl.name} />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="add1" className="font-bold text-red-800">Address Line 1</Label>
                                            <Input  id={`${index}-add1`} className="focus-visible:ring-offset-0 focus-visible:ring-0" value={tl.address1} />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="add2" className="font-bold text-red-800">Address Line 2</Label>
                                            <Input  id={`${index}-add2`} className="focus-visible:ring-offset-0 focus-visible:ring-0" value={tl.address2} />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="city" className="font-bold text-red-800">City</Label>
                                                <Input  id={`${index}-city`} className="focus-visible:ring-offset-0 focus-visible:ring-0" value={tl.city} />
                                            </div>
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="state" className="font-bold text-red-800">State</Label>
                                                <Input id={`${index}-state`} className="focus-visible:ring-offset-0 focus-visible:ring-0" value={tl.state} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="zip-code" className="font-bold text-red-800">Zip code</Label>
                                                <Input  id={`${index}-zip-code`} className="focus-visible:ring-offset-0 focus-visible:ring-0" value={tl.zip} />
                                            </div>
                                            {/* <div className="flex flex-col space-y-1.5">
                                                <Label htmlFor="weight" className="font-bold text-red-800">Weight</Label>
                                                <Input  id={`${index}-weight`} className="focus-visible:ring-offset-0 focus-visible:ring-0" value={tl.weight} />
                                            </div> */}
                                        </div>
                                    </div>

                                </CardContent>

                            </Card>
                        ))
                    }
                </div>

            </SheetContent>
        </Sheet>
    )
}

export default TableLookup