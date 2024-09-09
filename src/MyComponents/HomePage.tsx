
import { useNavigate } from "react-router-dom"
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  BookCheckIcon,
  BookmarkXIcon,
  BookOpenIcon,
  BotIcon,
  BotOffIcon,
  CircleAlertIcon,
  CircleHelpIcon,
  FileCog2Icon,
  FileScanIcon,
  FlipHorizontal2Icon,
  FullscreenIcon,
  HardDriveDownloadIcon,
  Image,
  ImageIcon,
  ListRestartIcon,
  Loader2Icon,
  MonitorCogIcon,
  PencilLine,
  RadioTowerIcon,
  RefreshCcwDot,
  RefreshCcwIcon,
  Rotate3dIcon,
  RotateCcwIcon,
  ShrinkIcon,
  ViewIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Accounts } from "./Accounts"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Items } from "@/Mytypes"
import ImageViewer from "@/MyComponents/ImageViewer"

import { useEffect, useMemo, useRef, useState } from "react"
import Cookies from "js-cookie"
import { AxiosInstance } from "axios"
import { useDispatch, useSelector } from "react-redux"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { addInstruction, addItems, changeInstructionsData, changeItemData, changeRequestMode, changeRequestProperty } from "@/reducers/requestReducer"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { BillingInput } from "./BillingInput"

import logo from "@/assets/img/ddc_connect3_dark_red.png"
import logo_light from "@/assets/img/ddc_connect3.png"
import { coookie_options } from "@/config"
import SideBar from "./SideBar"
import { toggleFullscreen, toggleImageViewer } from "@/reducers/viewReducers"

import { toggleValidation } from "@/reducers/validationReducer"
import useItemCalculations from "@/hooks/calculations"
import AccountsInputWrapper from "./AccountsInputWrapper"
import { changeData } from "@/reducers/originalRequestDataReducer"
import ImageViewerWrapper from "./ImageViewerWrapper"
import { toast } from "sonner"
import useAuthValidatorAlerts from "@/hooks/authValidatorAlerts"

interface Props {
  reloadingImg: boolean;
  api: AxiosInstance;
  handleRequestEntry: () => void;
  isReadyForRequest: () => void;
  saveEntry: () => void;
  logout: () => void;
  hasPendingRequest: () => boolean;
  setShowRejectModal: (arg: boolean) => void;
  refetchImg: () => void;
  reloadData: () => void;
  savingRef: any
}

interface OtherDisplay {
  label: string;
  property: string
}

const otherDataToDisplay: OtherDisplay[] = [
  { label: "PRO Number", property: "pronumber" },
  { label: "BOL Number", property: "bolNumber" },
  // { label: "Master BOL Number", property: "masterBolNumber" },
  { label: "Econtrol Number", property: "econtrolNumber" },
  { label: "Shipper Number", property: "shipperNumber" },
  { label: "PO Number", property: "poNumber" },
  { label: "Quote Number", property: "quoteNumber" },
  { label: "RA Number", property: "raNumber" },
  // { label: "RUN Number", property: "runNumber" },
  // { label: "Driver Number", property: "driverNumber" },
]

const otherItemDataToDisplay: OtherDisplay[] = [
  { label: "Total Handling Unit", property: "totalHandlingUnit" },
  { label: "Total Pallet Count", property: "totalPalletCount" },
  { label: "Total Pieces", property: "totalPieces" },
  { label: "Total Weight", property: "totalWeight" }
]
export function HomePage(props: Props) {

  const { handleRequestEntry, isReadyForRequest, saveEntry, savingRef, logout, api, setShowRejectModal, refetchImg, reloadingImg, reloadData } = props
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { calculateAllItemsData } = useItemCalculations();

  const request_data = useSelector((state: any) => state.request_reducer);
  const ocr_data = useSelector((state: any) => state.ocr_data);
  const original_data = useSelector((state: any) => state.original_request_reducer);
  const validation_data = useSelector((state: any) => state.validation_Reducer);
  const theme_data = useSelector((state: any) => state.theme_reducer);
  const view_data = useSelector((state: any) => state.view_reducer);

  // const tabIndex_data = useSelector((state: any) => state.tabIndex_data);

  const request_mode = useMemo(() => request_data.auto_request, [request_data]);
  const items: Items[] = useMemo(() => request_data.request_json.items, [request_data]);
  const instructions: any = useMemo(() => request_data.request_json.instructions, [request_data])
  const requesting = useMemo(() => request_data.requesting, [request_data]);
  const fullscreen = useMemo(() => view_data.fullscreen, [view_data]);
  const showImageViewer = useMemo(() => view_data.showImageViewer, [view_data]);
  const [loadingImg, setLoadingImg] = useState<boolean>(false)
  const theme = useMemo(() => theme_data.current_theme, [theme_data]) || "dark";

  const [currentImg, setCurrentImg] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(0)
  const themeRef = useRef(theme)
  const currentPageRef = useRef(currentPage)
  const { tokenExpired } = useAuthValidatorAlerts();

  const [pressedKey, setPressedKey] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemRef = useRef<HTMLInputElement | null>(null);
  const disableBillingInput = (field: string) => {
    // const disable_fields = ["driverNumber",
    //   "econtrolNumber",
    //   "masterBolNumber",
    //   "quoteNumber",
    //   "raNumber",
    //   "runNumber"];
    const disable_fields_ = ["s"];
    if (disable_fields_.includes(field)) {
      return true
    }
    return false
  }

  const isQc = () => {
    if (Cookies.get("role") === "ROLE_QC" || Cookies.get("role") === "ROLE_AUDITOR") return true

    return false
  }
  // ACTIONS
  useEffect(() => {
    // Define the event handler
    const handleKeyDown = (event: KeyboardEvent) => {


      if (event.ctrlKey && (event.key === 'ArrowUp' || event.key === 'ArrowRight')) {
        // Prevent default action if necessary
        event.preventDefault();

        const page = currentPageRef.current + 1
        const json_ = JSON.parse(Cookies.get("request_info") || "")
        const max_page = parseInt(json_.details.pages)

        if (page > max_page) return
        changeImg(page)
      }
      if (event.ctrlKey && (event.key === 'ArrowDown' || event.key === 'ArrowLeft')) {
        // Prevent default action if necessary
        event.preventDefault();
        const page = currentPageRef.current - 1

        if (page === 0) return
        changeImg(currentPageRef.current - 1)
      }
    };



    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {

    if (request_mode) {
      handleRequestEntry()
    } else {
      if (Cookies.get("request_info")) {

        const request_info = JSON.parse(Cookies.get("request_info") || "")
        const img_urls = JSON.parse(Cookies.get("img_urls") || "");
        const request_json = JSON.parse(Cookies.get("request_json") || "")
        const orginal_request_data = JSON.parse(Cookies.get("original_request_data") || "")

        const request_info_ = { newValue: request_info, property: "request_info" };
        // const img_urls_ = { newValue: [img_urls], property: "img_urls" };
        // const request_json_ =  { newValue: request_json, property: "request_json" };

        dispatch(changeRequestProperty(request_info_))
        dispatch(changeRequestProperty(img_urls))
        dispatch(changeRequestProperty(request_json))
        dispatch(changeData(orginal_request_data))
      }
    }

  }, [])


  useEffect(() => {
    if (request_data.img_urls.length < 1) {
      setCurrentImg("")
      setCurrentPage(0)
      currentPageRef.current = 0

      return;
    }
    const image_urls_ = request_data.img_urls.map((img: string) => ({ url: img }))

    console.log(image_urls_)


    if (currentPage <= 1) {

      setCurrentImg(image_urls_[0].url)
      setCurrentPage(1)
      currentPageRef.current = 1
    }

  }, [request_data])


  useEffect(() => {

    if (!Cookies.get("jt")) {
      navigate("login")
      return
    };
  }, [])

  useEffect(() => {

    if (!items) return;

    calculateAllItemsData(items)
  }, [items])


  useEffect(() => {
    Cookies.set("auto_request", request_mode, coookie_options)

  }, [request_mode])

  useEffect(() => {

    if (fullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }

    }
  }, [fullscreen])



  const changeImg = async (pageNumber: number) => {


    const token = Cookies.get("jt")

    if (!token) {
      tokenExpired();
    }

    const parseFile = JSON.parse(Cookies.get("request_info") || "")
    const filename = parseFile.details.document
    const tempCurpage = currentPageRef.current
    setCurrentPage(pageNumber);
    currentPageRef.current = pageNumber
    setLoadingImg(true)
    try {
      const response2 = await api.get(`/document/get-image/${filename}/${pageNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: "blob",
      })

      const blob = new Blob([response2.data], { type: "jpg" });
      const url = URL.createObjectURL(blob);
      setCurrentImg(url)

      const img_urls = { newValue: [url], property: "img_urls" };
      dispatch(changeRequestProperty(img_urls))
      Cookies.set("img_urls", JSON.stringify(img_urls), coookie_options)
    } catch (error: any) {

      if (error.response.data instanceof Blob) {
        const errorMessage = await error.response.data.text(); // Convert the blob to text
        const errmsg = JSON.parse(errorMessage)

        if (errmsg.status == "403") {
          tokenExpired()
          return
        }
        toast.error(errmsg.details, {
          description: errmsg.message,
          duration: 3000
        })
      }
      setCurrentPage(tempCurpage)
      currentPageRef.current = tempCurpage
    } finally {

      setLoadingImg(false)
    }


  }
  const renderErr = (property: string) => {

    const existingError = validation_data.errors.find((error: any) => error.property === property);

    if (!existingError) return null;
    if (existingError?.newValue.length < 1) return null;
    return (

      <Popover>
        <PopoverTrigger>
          <CircleAlertIcon className=" hover:cursor-pointer absolute w-3 h-3 right-2   text-red-800" style={{ top: "47%" }} />
        </PopoverTrigger>
        <PopoverContent>
          <Command className="rounded-lg bg-red-200  ">

            <CommandList>

              <CommandGroup heading={<p className="font-extrabold text-md uppercase">{property} Errors</p>}>

                {
                  validation_data.errors.filter((item: any) => item.property === property).flatMap((item: any, index: number) =>
                    item.newValue.map((message: string, messageIndex: number) => (

                      <CommandItem key={`${index}-${messageIndex}`}>

                        <span className="text-slate-900 font-bold" style={{ color: "#000" }}>{messageIndex + 1 + ".)"} &nbsp;{message}.</span>
                      </CommandItem>
                    ))
                  )
                }

              </CommandGroup>


            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

    )

  };


  const getInstructionOcrData = (index: number, data: number) => {
    //DATA 1 IS CODE 2 IS CONTENT
    if (data === 1) {

      return ocr_data?.request_json?.instructions?.lines[index]?.code

    }
    return ocr_data?.request_json?.instructions?.lines[index]?.content

  }
  const getItemData = (index: number, data: string) => {

    try {
      return ocr_data?.request_json?.items[index][data]
    } catch (error) {

    }
    return

  }

  const isInstructionMisMatch = (value: any, ocr_data: any, tabIndex: number) => {
    if (!Cookies.get("role")) return false
    if (Cookies.get("role") !== "ROLE_QC" && Cookies.get("role") !== "ROLE_AUDITOR") return false

    if (!Cookies.get("request_ocr_json")) return false
    if (value === undefined && ocr_data === null || value === null && ocr_data === undefined || value === "" && ocr_data === "") {
      return false
    }
    if (value !== ocr_data) {

      if (!Cookies.get("tabIndex")) {
        Cookies.set("tabIndex", JSON.stringify([tabIndex]), coookie_options)
        return true
      }

      let indexes = JSON.parse(Cookies.get("tabIndex") || "")
      if (!indexes.includes(tabIndex)) {
        indexes.push(tabIndex)
        Cookies.set("tabIndex", JSON.stringify(indexes), coookie_options)
      }
      return true
    }


  }
  const isItemMisMatch = (value: any, ocr_data: any, tabIndex: number) => {

    if (!Cookies.get("role")) return false
    if (Cookies.get("role") !== "ROLE_QC" && Cookies.get("role") !== "ROLE_AUDITOR") return false
    if (!Cookies.get("request_ocr_json")) return false
    // console.log("org", value)
    // console.log("ocr", ocr_data)
    if (value === undefined && ocr_data === null || value === null && ocr_data === undefined || value === "" && ocr_data === "") {
      return false
    }
    if (value !== ocr_data) {

      if (!Cookies.get("tabIndex")) {
        Cookies.set("tabIndex", JSON.stringify([tabIndex]), coookie_options)
        return true
      }

      let indexes = JSON.parse(Cookies.get("tabIndex") || "")
      if (!indexes.includes(tabIndex)) {
        indexes.push(tabIndex)
        Cookies.set("tabIndex", JSON.stringify(indexes), coookie_options)
      }
      return true
    }


  }


  // Function to handle key press events
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number, property: string) => {
    e.preventDefault()
    if (e.altKey && e.key === "1") {

      e.preventDefault()
      if (!isQc()) return
      setPressedKey(1)
      let d = ocr_data?.request_json?.instructions?.lines[index][property]

      dispatch(changeInstructionsData({ parent_property: "lines", index, property: property, newValue: d }))
      inputRef.current = e.currentTarget;
      if (inputRef.current) {
        inputRef.current.style.backgroundColor = "#50B498"
      }
      return
    }
    if (e.altKey && e.key === "2") {

      e.preventDefault()
      if (!isQc()) return
      setPressedKey(2)

      let d = original_data?.request_json?.instructions?.lines[index][property]

      dispatch(changeInstructionsData({ parent_property: "lines", index, property: property, newValue: d }))
      inputRef.current = e.currentTarget;
      if (inputRef.current) {
        inputRef.current.style.backgroundColor = "transparent"
      }
      return
    }
    if (e.altKey && e.key === "3") {
      e.preventDefault()
      if (!isQc()) return

      if (pressedKey === 3) {
        setPressedKey(null)
        if (inputRef.current) {
          inputRef.current.style.backgroundColor = "transparent"
        }
        return
      }
      setPressedKey(3)
      inputRef.current = e.currentTarget;
      if (inputRef.current) {
        inputRef.current.style.backgroundColor = '#FABC3F'; // or any color you like
      }
      return
    }


  };
  const hanleOnChange = (value: string, index: number, property: string) => {
    alert("S")
    console.log(value)
    if (Cookies.get("role") === "ROLE_QC" || Cookies.get("role") === "ROLE_AUDITOR") {
      console.log("hessre")
      if (pressedKey === 1) {
        setPressedKey(null)
        return
      }
      if (pressedKey === 2) {
        setPressedKey(null)
        return
      }
      if (pressedKey === 3) {
        setPressedKey(3)
        console.log("update")
        dispatch(changeInstructionsData({ parent_property: "lines", index, property: property, newValue: value }))
        return
      }
      return
    }

    dispatch(changeInstructionsData({ parent_property: "lines", index, property: property, newValue: value }))
  }

  const handleItemKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number, property: string) => {



    if (e.altKey && e.key === "1") {
      e.preventDefault()
      if (!isQc()) return
      setPressedKey(1)
      let d = ""

      try {
        d = ocr_data?.request_json?.items[index][property]
      } catch (error) {
        d = ""
      }
      dispatch(changeItemData({ newValue: d, index, property: property }))
      itemRef.current = e.currentTarget;
      if (itemRef.current) {
        itemRef.current.style.backgroundColor = "#50B498"
      }
      return
    }
    if (e.altKey && e.key === "2") {
      e.preventDefault()
      if (!isQc()) return
      setPressedKey(2)
      let d = original_data?.request_json?.items[index][property]
      dispatch(changeItemData({ newValue: d, index, property: property }))
      itemRef.current = e.currentTarget;
      if (itemRef.current) {
        itemRef.current.style.backgroundColor = "transparent"
      }
      return
    }
    if (e.altKey && e.key === "3") {
      e.preventDefault()
      if (!isQc()) return

      if (pressedKey === 3) {
        setPressedKey(null)
        if (itemRef.current) {
          itemRef.current.style.backgroundColor = "transparent"
        }
        return
      }
      setPressedKey(3)
      itemRef.current = e.currentTarget;
      if (itemRef.current) {
        itemRef.current.style.backgroundColor = '#FABC3F'; // or any color you like
      }
      return
    }


  };

  const hanleOnItemChange = (value: string, index: number, property: string) => {

    if (Cookies.get("role") === "ROLE_QC" || Cookies.get("role") === "ROLE_AUDITOR") {


      if (pressedKey === 1) {
        setPressedKey(null)
        return
      }
      if (pressedKey === 2) {
        setPressedKey(null)
        return
      }
      if (pressedKey === 3) {
        setPressedKey(3)
        // dispatch(changeInstructionsData({ parent_property: "lines", index, property: property, newValue: value }))
        dispatch(changeItemData({ newValue: value, index, property: property }))
        return
      }
      return
    }
    dispatch(changeItemData({ newValue: value, index, property: property }))
    // dispatch(changeInstructionsData({ parent_property: "lines", index, property: property, newValue: value }))
  }

  useEffect(() => {

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.style.backgroundColor = "transparent";
    });

    if (inputRef.current) {
      inputRef.current.style.backgroundColor = "transparent"
    }
    if (itemRef.current) {

      itemRef.current.style.backgroundColor = "transparent"
    }

    inputRef.current = null

    itemRef.current = null

  }, [original_data, ocr_data, savingRef])
  const getItemTabIndex = (i: number) => {
    let instructionLength: number = 0

    if (instructions) {
      if (instructions.lines) {
        instructionLength = instructions.lines.length * 2

      }

    }
    return (37 + i + instructionLength)
  }


  // const Instructions = () = > {

  // }
  return (

    <div className={cn(requesting ? "cursor-wait" : "", "max-h-100")}  >

      <div className="flex relative min-h-screen w-full flex-col bg-muted/40">
        <SideBar logout={logout} themeRef={themeRef} />

        <div className="flex flex-col h-screen sm:gap-4 sm:py-4 sm:pl-14">

          <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 mb-4">

            <div className="flex justify-between w-full items-center">
              <div className="w-80 relative">
                {/* <img src={themeRef.current == "dark" ? logo_light : logo} className="w-full h-20" /> */}
                <img src={logo} className="w-full  h-20 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <img src={logo_light} className="w-full absolute h-20 top-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " />
              </div>

           
              <div className="flex items-center ">
              <div className=" border-b  border-t border-gray-300 p-[.6px]" >
                <p className="mr-10 bg-slate-200 p-2" >Role : <span className="ml-5 text-red-900 font-bold">{Cookies.get("role")}</span></p>
              </div>
                <div className="flex items-center bg-red-800 rounded pr-5 dark:bg-white">

                  <Menubar className="bg-transparent border-none text-white dark:text-slate-950 " >
                    <MenubarMenu >
                      <MenubarTrigger><FileCog2Icon className="w-4 h-4 mr-1" /> File</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem disabled={requesting} onClick={() => saveEntry()}>
                          <HardDriveDownloadIcon className="h-4 w-4 mr-2" /> Save <MenubarShortcut>F2</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled={requesting} onClick={() => isReadyForRequest()}>
                          <RadioTowerIcon className="h-4 w-4 mr-2" />  Request <MenubarShortcut>F1</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled={requesting} onClick={() => setShowRejectModal(true)}>
                          <BookmarkXIcon className="h-4 w-4 mr-2" />  Reject <MenubarShortcut>F3</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled={requesting} onClick={() => reloadData()}>
                          <ListRestartIcon className="h-4 w-4 mr-2" />  Reload Data <MenubarShortcut>⌘+F7</MenubarShortcut>
                        </MenubarItem>

                      </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu >
                      <MenubarTrigger><PencilLine className="h-4 w-4 mr-2" /> Image Control</MenubarTrigger>
                      <MenubarContent className="w-52">
                        <MenubarItem disabled={requesting}  >
                          <Rotate3dIcon className="w-4 h-4 mr-2" />  Rotate Left <MenubarShortcut>⌘+L</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled={requesting}  >
                          <FlipHorizontal2Icon className="w-4 h-4 mr-2" /> Flip <MenubarShortcut>⌘+F</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled={requesting}  >
                          <ZoomInIcon className="w-4 h-4 mr-2" />  Zoom In <MenubarShortcut>⌘+I</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled={requesting}  >
                          <ZoomOutIcon className="w-4 h-4 mr-2" />    Zoom Out <MenubarShortcut>⌘+O</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled={requesting}  >
                          <RotateCcwIcon className="w-4 h-4 mr-2" />   Reset <MenubarShortcut>⌘+S</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled={requesting} onClick={() => refetchImg()}>
                          <RefreshCcwDot className="h-4 w-4 mr-2" />  Reload Image <MenubarShortcut>F4</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem className="flex" disabled={requesting} onClick={() => changeImg(currentPageRef.current + 1)}>
                          <ArrowRightCircleIcon className="h-4 w-4 mr-2" />  Next Image <MenubarShortcut>Ctrl + 🡢</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled={requesting} onClick={() => changeImg(currentPageRef.current - 1)}>
                          <ArrowLeftCircleIcon className="h-4 w-4 mr-2" />  Prev Image <MenubarShortcut>Ctrl + 🡠
                          </MenubarShortcut>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                      <MenubarTrigger className=" dark:border-slate-900 rounded-sm pr-5"> <ViewIcon className="w-4 h-4 mr-2" /> View</MenubarTrigger>
                      <MenubarContent>

                        <MenubarItem disabled={requesting}  >
                          <RefreshCcwIcon className="w-4 h-4 mr-2" />
                          Reload <MenubarShortcut>⌘R</MenubarShortcut>
                        </MenubarItem>

                        <MenubarSeparator />
                        <MenubarItem disabled={requesting} onClick={() => dispatch(toggleFullscreen())} >
                          {fullscreen ? <ShrinkIcon className="w-4 h-4 mr-2" /> : <FullscreenIcon className="w-4 h-4 mr-1" />}Toggle Fullscreen
                        </MenubarItem>
                        <MenubarItem disabled={requesting} onClick={() => dispatch(toggleImageViewer())} >
                          {showImageViewer ? <Image className="w-4 h-4 mr-2" /> : <FullscreenIcon className="w-4 h-4 mr-1" />}Toggle Image Viewer
                        </MenubarItem>
                        <MenubarSeparator />

                      </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                      <MenubarTrigger className=" dark:border-slate-900  pr-5">
                        <MonitorCogIcon className="w-4 h-4 mr-2" /> Functions</MenubarTrigger>
                      <MenubarContent>

                        <MenubarItem disabled={requesting} onClick={() => dispatch(toggleValidation())}  >
                          {validation_data.isValidationOn ? <BotOffIcon className="w-4 h-4 mr-2" /> : <BotIcon className="w-4 h-4 mr-2" />}
                          {validation_data.isValidationOn ? "Disable" : "Enable"} Validation
                        </MenubarItem>


                      </MenubarContent>
                    </MenubarMenu>

                    {Cookies.get("role") === "ROLE_QC" && <MenubarMenu>
                      <MenubarTrigger className="border-r-2 border-white dark:border-slate-900  pr-5">
                        <FileScanIcon className="w-4 h-4 mr-2" /> QC</MenubarTrigger>
                      <MenubarContent className="w-60">
                        <Label className="ml-2 ">Select Options</Label>
                        <MenubarSeparator />
                        <MenubarItem className="mt-2">
                          <BookOpenIcon className="w-4 h-4 mr-2" /> Ocr Data <MenubarShortcut className="text-white p-1 border-none rounded-full bg-green-900">Alt + 1</MenubarShortcut>
                        </MenubarItem>

                        <MenubarItem>
                          <PencilLine className="w-4 h-4 mr-2" /> Edit <MenubarShortcut className="text-white p-1 border-none rounded-full bg-yellow-600"> Alt + 3</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                          <BookCheckIcon className="w-4 h-4 mr-2" /> Verified Data <MenubarShortcut className="border-b border-slate-700"> Alt + 2</MenubarShortcut>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>}

                  </Menubar>

                  <div className="flex items-center space-x-5 ml-3">
                    <div className="flex items-center space-x-2">
                      <Switch className="bg-red-900" disabled={requesting} id="airplane-mode" checked={request_mode} onCheckedChange={() => dispatch(changeRequestMode({ newValue: !request_mode }))} />
                      <Label htmlFor="airplane-mode" className="text-white dark:text-slate-950">Auto Request </Label>
                    </div>

                    <div>
                      <Sheet>
                        <SheetTrigger asChild>
                          <CircleHelpIcon className="text-white dark:text-slate-800 hover:cursor-pointer hover:animate-in" />
                        </SheetTrigger>
                        <SheetContent className="h-full">
                          <SheetHeader>
                            <SheetTitle className="flex items-center">
                              <BotIcon className="animate-bounce mr-2 transition duration-5000" />
                              System Assistance</SheetTitle>
                            <SheetDescription>
                              A comprehensive guide to optimize your billing process.

                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-10 h-full " >
                            <Command className="rounded-lg  shadow-md ">
                              <CommandInput placeholder="Search for a key word" />
                              <CommandList className=" max-h-[500px] mt-3">
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup heading="Error / Invalid data Guide">
                                  <CommandItem>

                                    <span>Red marked indicates invalid data specific in that field.</span>
                                  </CommandItem>
                                  <CommandItem>

                                    <p>You can click on</p>
                                    <CircleAlertIcon className="h-4 w-4 ml-1 mr-1 text-red-900" />
                                    <p>, to view error details.</p>

                                  </CommandItem>
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Auto remove invalid characters">
                                  <CommandItem>

                                    <span>Auto-remove tools will appear if you right-click in a field.</span>
                                  </CommandItem>

                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Functions">
                                  <CommandItem>

                                    <span>Adjust auto-request settings to your preference. When enabled, it will request automatically after save.</span>
                                  </CommandItem>

                                  <CommandItem>

                                    <span>Adjust auto-validation settings to your preference. When enabled, it will automatically perform validation and prevent you from saving if theres still invalid data.</span>
                                  </CommandItem>

                                </CommandGroup>
                                <CommandGroup heading="Image Control">
                                  <CommandItem>
                                    <span>You can right-click on the image to open it in a new tab, which will give you a better view of both the image and the billing form. </span>
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </div>

                        </SheetContent>
                      </Sheet>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </header>
          <main className="grid flex-1 h-full " >
            {/* {JSON.stringify(tabIndex_data)} */}
            <ResizablePanelGroup direction="horizontal" className="rounded-lg " style={{ height: "95vh" }}>
              {showImageViewer &&
                <>
                  <ResizablePanel defaultSize={35} minSize={35}>
                    <div className="grid px-6">
                      <div className="flex items-center justify-between pr-2">
                        <div className="flex items-center justify-between">
                          <ImageIcon className="w-5 h-5 mr-1 text-red-800 dark:text-white" />
                          <p className="p-2 rounded text-red-800 dark:text-white uppercase font-extrabold">Image Viewer</p>

                        </div>

                        <div className=" flex items-center justify-center ">
                          <p className="text-slate-600 ml-7 font-semibold text-xs"><span className="mr-3">Page : </span> {currentPage} / {request_data?.request_info?.details?.pages}  </p>
                          {/* <Carousel
                          opts={{
                            align: "start",
                          }}
                          className="w-5/6  "
                        >
                          <CarouselContent className=" h-[30px] flex justify-center ">

                            {imgUrls.length > 0 ? Array.from({length: request_data?.request_info?.details?.pages}).map((url, index) => (
                              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-0">
                                  <Card className="hover:cursor-pointer bg-transparent border-none">
                                    <CardContent className="relative flex items-center justify-center " 
                                
                                    onClick={() => {changeImg(index + 1)}}
                                    >
                               
                                      <span className={cn(currentPage === index + 1 ? "bg-red-700 border-none text-white  rounded-md" : "", "hover:border-2 border-red-500 px-2 rounded-md  font-semibold ")}>
                                
                                        {index + 1}
                                      </span>
                                     
                                    </CardContent>
                                  </Card>
                                </div>
                              </CarouselItem>
                            )) : ""}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel> */}
                        </div>

                      </div>

                      <div className="p-4 border mt-4 rounded-md h-[700px]">

                        {reloadingImg || loadingImg ? <div className="flex flex-col items-center justify-center mt-60">
                          <Loader2Icon className="w-10 h-10 animate-spin text-slate-700" />
                          <p className="mt-4 text-slate-700">Please wait ...</p>
                        </div> : <ImageViewerWrapper img={currentImg} >
                          <div className="relative z-10 w-fit h-fit mb-20">


                            {currentImg ? <ImageViewer image={currentImg}
                              alt="temp.jpg" /> : <img

                              src="https://ui.shadcn.com/placeholder.svg"
                              alt="Image"
                              // width="1920"
                              // height="1080"
                              className={cn(
                                {
                                  "animate-pulse": request_data.saving,
                                },
                                "h-full w-full object-cover dark:brightness-[0.1] dark:grayscale"
                              )}
                            />}


                          </div>

                        </ImageViewerWrapper>
                        }

                      </div>

                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle className="w-1" />
                </>
              }

              <ResizablePanel defaultSize={100} minSize={50}>
                <div className={cn(
                  {
                    "animate-pulse": request_data.saving,
                  },
                  "grid w-full gap-4 pl-6 overflow-y-auto  overflow-x-scroll scrollbar-hide"
                )} style={{ height: "100%" }}>


                  <div className="flex items-start justify-between pr-10 ">
                    <div className="flex items-center">
                      <BookOpenIcon className="w-5 h-5 mr-1 text-red-900 dark:text-white" />
                      <p className="p-2 rounded text-red-800 dark:text-white uppercase font-extrabold">Billing Information</p>
                    </div>
                    <p className="text-xs text-slate-800 font-normal" > <span className="text-xs mr-3 font-bold text-slate-700">Document Name:  </span>{request_data?.request_info?.details?.document}</p>
                  </div>
                  <div className={cn(Cookies.get("role") === "ROLE_QC" ? "grid-cols-3" : "grid-cols-4", "grid gap-2 ")}>

                    {request_data.request_json ? otherDataToDisplay.map((display: any, index: number) =>
                      <BillingInput key={index} pos={index + 1} original_data={original_data.request_json[display.property]} ocr_data={ocr_data.request_json[display.property]} value={request_data.request_json[display.property]}
                        property={display.property} label={display.label} disable={disableBillingInput(display.property)} />)
                      : ""}
                  </div>

                  <div className="flex flex-col flex-wrap w-full gap-4 accounts-wrapper sm:flex-row">



                    <div className="grid flex-1 w-full gap-6">
                      <Card x-chunk="accounts-02-chunk-2">
                        <CardHeader>
                          <CardTitle className="text-sm text-red-800 dark:text-white uppercase font-extrabold">Shipper (Ship From)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accounts savingRef={savingRef} identifier="shipper" api={api} key={2} label="shipper (ship from)" />
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid flex-1 w-full gap-4">
                      <Card x-chunk="accounts-01-chunk-2">
                        <CardHeader>
                          <CardTitle className="text-sm text-red-800 dark:text-white uppercase font-extrabold">Consignee (Ship To)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accounts savingRef={savingRef} identifier="consignee" api={api} key={1} label="consignee (ship to)" />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid flex-1 w-full gap-6">
                      <Card x-chunk="accounts-03-chunk-2">
                        <CardHeader>
                          <CardTitle className="text-sm text-red-800 dark:text-white uppercase font-extrabold">Bill To (Third Party)</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                          <Accounts savingRef={savingRef} identifier="billTo" api={api} key={3} label="billTo (third party)" />
                        </CardContent>
                      </Card>
                    </div>

                  </div>
                  <div className="grid flex-1 w-full gap-6">
                    <Card x-chunk="entry-02-chunk-2">
                      <CardHeader>
                        <CardTitle className="text-sm">

                          <div className="flex justify-between">
                            <p className="text-red-800 dark:text-white uppercase font-extrabold"> Instructions</p>
                            <Button className="bg-red-900  hover:bg-red-900 dark:bg-white dark:hover:bg-white" size={"sm"} disabled={requesting || !Cookies.get("request_info")} onClick={() => dispatch(addInstruction())}>Add Instructions</Button>
                          </div>

                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4">

                        {
                          instructions ?
                            [instructions]?.map((td: any) =>
                              td?.lines?.map((_l: any, index: number) =>
                                <div className="flex gap-2">
                                  {/* <div className="w-1/6">
                                    <AccountsInputWrapper instructions={instructions} label={`${index}-Instruction`} value={td.lines[index].content || ""} identifier={"instructions"} isInstruction={true} itemIndex={index} >
                                      <div className={"flex flex-col w-full gap-y-2"}>
                                        <Label className="text-red-800 dark:text-white">Code {37 + (index + 1)} - {index}</Label>
                                        {isQc() && <p className="ml-1 text-green-900 font-bold" >{getInstructionOcrData(index, 1) || <span className="text-transparent">d</span>}</p>}
                                        <Input id={`inst${index}`} onBlur={() => setPressedKey(null)} tabIndex={37 + (index + 1)} onKeyDown={(e) => handleKeyPress(e, index, "code")}
                                          className={cn(isInstructionMisMatch(td.lines[index].code, getInstructionOcrData(index, 1), (37 + (index + 1))) ? "border border-red-600 rounded-md" : "", " dark:focus:bg-slate-800 focus:bg-blue-100 focus-visible:ring-offset-0 focus-visible:ring-0 ")}
                                          disabled={requesting} key={index} value={td.lines[index].code} onChange={(e) => hanleOnChange(e.target.value, index, "code")} />

                                      </div>
                                    </AccountsInputWrapper>
                                  </div> */}
                                  <div className="w-full">
                                    <AccountsInputWrapper instructions={instructions} label={`${index}-Instruction`} value={td.lines[index].content || ""} identifier={"instructions"} isInstruction={true} itemIndex={index} >
                                      <div className={"flex flex-col w-full gap-y-2"}>
                                        <Label className="text-red-800 dark:text-white">Description </Label>
                                        {isQc() && <p className="ml-1 text-green-900 font-bold" >{getInstructionOcrData(index, 2) || <span className="text-transparent">d</span>}</p>}
                                        <Input
                                          onBlur={() => setPressedKey(null)}
                                          tabIndex={37 + (index + 2)}
                                          id={`inst-content${index}`}
                                          onKeyDown={(e) => handleKeyPress(e, index, "content")}
                                          className={cn(isInstructionMisMatch(td.lines[index].content, getInstructionOcrData(index, 2), (37 + (index + 2))) ? "border border-red-600 rounded-md" : "", " dark:focus:bg-slate-800 focus:bg-blue-100 focus-visible:ring-offset-0 focus-visible:ring-0 ")}
                                          disabled={requesting} key={index} value={td.lines[index].content} onChange={(e) => hanleOnChange(e.target.value, index, "code")} />

                                      </div>
                                    </AccountsInputWrapper>
                                  </div>
                                </div>

                              )
                            )
                            : ""}

                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid flex-1 w-full gap-6">
                    <Card x-chunk="entry-03-chunk-2">
                      <CardHeader>
                        <CardTitle className="text-sm">
                          <div className="flex justify-between">
                            <p className="text-red-800 dark:text-white uppercase font-extrabold"> Items</p>
                            <Button className="bg-red-900 hover:bg-red-900 dark:bg-white dark:hover:bg-white" disabled={requesting || !Cookies.get("request_info")} size={"sm"} onClick={() => dispatch(addItems())}>Add Item</Button>
                          </div>


                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        <div className="grid gap-2 grid-cols-4">
                          {request_data.request_json ? otherItemDataToDisplay.map((display: any, index: number) => <BillingInput original_data="" pos={0} ocr_data={""} disable={true} key={index} value={request_data.request_json[display.property]} property={display.property} label={display.label} />) : ""}
                        </div>

                        <Table>
                          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                          <TableHeader>
                            <TableRow>

                              <TableHead >Pallet</TableHead>
                              <TableHead>Handling Unit</TableHead>
                              <TableHead>Package Type</TableHead>
                              <TableHead >Pieces</TableHead>
                              <TableHead >Description</TableHead>
                              <TableHead>Weight</TableHead>
                              <TableHead>Item Class</TableHead>
                              <TableHead >NMFC</TableHead>
                              <TableHead >Dimension</TableHead>

                            </TableRow>
                          </TableHeader>
                          <TableBody>

                            {items?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="px-1" >
                                  <AccountsInputWrapper label={`${index}-Pallet`} value={item.pallet || ""} identifier={"pallet"} isItem={true} itemIndex={index} >
                                    <div className="flex flex-col  ">
                                      {isQc() && <p className="ml-2 text-green-900 font-bold" >{getItemData(index, "pallet") || <span className="text-transparent">d</span>}</p>}
                                      <Input className={cn(isItemMisMatch(item.pallet, getItemData(index, "pallet"), getItemTabIndex(index + 1)) ? " border-2 border-red-700" : "", "  dark:focus:bg-slate-800 focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 ")}
                                        disabled={requesting} value={item.pallet}
                                        onChange={(e) => hanleOnItemChange(e.target.value, index, "pallet")}
                                        onKeyDown={(e) => handleItemKeyPress(e, index, "pallet")}
                                        tabIndex={getItemTabIndex(index + 1)}
                                      />
                                    </div>
                                  </AccountsInputWrapper>
                                </TableCell>
                                <TableCell className="px-1">
                                  <AccountsInputWrapper label={`${index}-Handling Unit`} value={item.handlingUnit || ""} identifier={"handlingUnit"} isItem={true} itemIndex={index} >
                                    <div className="flex flex-col">
                                      {isQc() && <p className="ml-2 text-green-900 font-bold" >{getItemData(index, "handlingUnit") || <span className="text-transparent">d</span>}</p>}
                                      <Input className={cn(isItemMisMatch(item.handlingUnit, getItemData(index, "handlingUnit"), getItemTabIndex(index + 2)) ? " border-2 border-red-700" : "", "  dark:focus:bg-slate-800 focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 ")}
                                        disabled={requesting} value={item.handlingUnit}
                                        onChange={(e) => hanleOnItemChange(e.target.value, index, "handlingUnit")}
                                        onKeyDown={(e) => handleItemKeyPress(e, index, "handlingUnit")}
                                        tabIndex={getItemTabIndex(index + 2)}
                                      />
                                    </div>

                                  </AccountsInputWrapper>
                                </TableCell>
                                <TableCell className="px-1">
                                  <AccountsInputWrapper label={`${index}-Package Type`} value={item.packageType || ""} identifier={"packageType"} isItem={true} itemIndex={index} >
                                    <div className="flex flex-col">
                                      {isQc() && <p className="ml-2 text-green-900 font-bold" >{getItemData(index, "packageType") || <span className="text-transparent">d</span>}</p>}
                                      <Input className={cn(isItemMisMatch(item.packageType, getItemData(index, "packageType"), getItemTabIndex(index + 3)) ? " border-2 border-red-700" : "", "  dark:focus:bg-slate-800 focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 ")}
                                        disabled={requesting} value={item.packageType}
                                        onChange={(e) => hanleOnItemChange(e.target.value, index, "packageType")}
                                        onKeyDown={(e) => handleItemKeyPress(e, index, "packageType")}
                                        tabIndex={getItemTabIndex(index + 3)} />

                                    </div>
                                  </AccountsInputWrapper>
                                </TableCell>
                                <TableCell className="relative px-1" >
                                  <div className="flex flex-col">
                                    {isQc() && <p className="ml-2 text-green-900 font-bold" >{getItemData(index, "pieces") || <span className="text-transparent">d</span>}</p>}
                                    <AccountsInputWrapper label={`${index}-Pieces`} value={item.pieces || ""} identifier={"pieces"} isItem={true} itemIndex={index} >


                                      <Input className={cn(
                                        {
                                          " border-2 border-red-700": isItemMisMatch(item.pieces, getItemData(index, "pieces"), getItemTabIndex(index + 4))
                                        },
                                        {
                                          " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${index}-pieces`),
                                        },
                                        " focus:bg-blue-100 dark:focus:bg-slate-800  focus-visible:ring-offset-0 focus-visible:ring-0  "
                                      )} disabled={requesting} value={item.pieces}
                                        onChange={(e) => hanleOnItemChange(e.target.value, index, "pieces")}
                                        onKeyDown={(e) => handleItemKeyPress(e, index, "pieces")}
                                        tabIndex={getItemTabIndex(index + 4)}
                                      />
                                      {renderErr(`${index}-pieces`)}

                                    </AccountsInputWrapper>
                                  </div>
                                </TableCell>
                                <TableCell className="px-1 w-[40rem]" >
                                  <AccountsInputWrapper label={`${index}-Description`} value={item.description || ""} identifier={"description"} isItem={true} itemIndex={index} >
                                    <div className="flex flex-col w-full">
                                      {isQc() && <p className="ml-2 text-green-900 font-bold" >{getItemData(index, "description") || <span className="text-transparent">d</span>}</p>}
                                      <Input className={cn(isItemMisMatch(item.description, getItemData(index, "description"), getItemTabIndex(index + 5)) ? " border-2 border-red-700" : "", "  dark:focus:bg-slate-800 focus:bg-blue-100  focus-visible:ring-offset-0 focus-visible:ring-0 ")}
                                        disabled={requesting} value={item.description}
                                        onChange={(e) => hanleOnItemChange(e.target.value, index, "description")}
                                        onKeyDown={(e) => handleItemKeyPress(e, index, "description")}
                                        tabIndex={getItemTabIndex(index + 5)}
                                      />
                                    </div>
                                  </AccountsInputWrapper>
                                </TableCell>
                                <TableCell className="relative px-1">
                                  <div className="flex flex-col">
                                    {isQc() && <p className="ml-2 text-green-900 font-bold" >{getItemData(index, "weight") || <span className="text-transparent">d</span>}</p>}
                                    <AccountsInputWrapper label={`${index}-Weight`} value={item.weight || ""} identifier={"weight"} isItem={true} itemIndex={index} >

                                      <Input
                                        className={cn(
                                          {
                                            " border-2 border-red-700": isItemMisMatch(item.weight, getItemData(index, "weight"), getItemTabIndex(index + 6))
                                          },
                                          {
                                            " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${index}-weight`),
                                          },
                                          " focus:bg-blue-100 dark:focus:bg-slate-800  focus-visible:ring-offset-0 focus-visible:ring-0  "
                                        )}
                                        disabled={requesting} value={item.weight}
                                        onChange={(e) => hanleOnItemChange(e.target.value, index, "weight")}
                                        onKeyDown={(e) => handleItemKeyPress(e, index, "weight")}
                                        tabIndex={getItemTabIndex(index + 6)}
                                      />
                                      {renderErr(`${index}-weight`)}

                                    </AccountsInputWrapper>
                                  </div>
                                </TableCell>
                                <TableCell className="relative px-1">
                                  <div className="flex flex-col">
                                    {isQc() && <p className="ml-2 text-green-900 font-bold" >{getItemData(index, "itemClass") || <span className="text-transparent">d</span>}</p>}
                                    <AccountsInputWrapper label={`${index}-Item Class`} value={item.itemClass || ""} identifier={"itemClass"} isItem={true} itemIndex={index} >
                                      <Input className={cn(
                                        {
                                          " border-2 border-red-700": isItemMisMatch(item.itemClass, getItemData(index, "itemClass"), getItemTabIndex(index + 7))
                                        },
                                        {
                                          " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${index}-itemClass`),
                                        },
                                        " focus:bg-blue-100 dark:focus:bg-slate-800  focus-visible:ring-offset-0 focus-visible:ring-0  "
                                      )} disabled={requesting} value={item.itemClass}
                                        onChange={(e) => hanleOnItemChange(e.target.value, index, "itemClass")}
                                        onKeyDown={(e) => handleItemKeyPress(e, index, "itemClass")}
                                        tabIndex={getItemTabIndex(index + 7)}
                                      />
                                      {renderErr(`${index}-itemClass`)}
                                    </AccountsInputWrapper>
                                  </div>
                                </TableCell>
                                <TableCell className="relative flex px-1" >
                                  <div className="flex flex-col">
                                    {isQc() && <p className="ml-2 text-green-900 font-bold" >{getItemData(index, "nmfc") || <span className="text-transparent">d</span>}</p>}
                                    <AccountsInputWrapper label={`${index}-NMFC`} value={item.nmfc || ""} identifier={"nmfc"} isItem={true} itemIndex={index} >
                                      <Input className={cn(
                                        {
                                          " border-2 border-red-700": isItemMisMatch(item.nmfc, getItemData(index, "nmfc"), getItemTabIndex(index + 8))
                                        },
                                        {
                                          " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${index}-nmfc`),
                                        },
                                        " focus:bg-blue-100  dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0  "
                                      )} disabled={requesting} value={item.nmfc}
                                        onChange={(e) => hanleOnItemChange(e.target.value, index, "nmfc")}
                                        onKeyDown={(e) => handleItemKeyPress(e, index, "nmfc")}
                                        tabIndex={getItemTabIndex(index + 8)}
                                      />
                                      {renderErr(`${index}-nmfc`)}
                                    </AccountsInputWrapper>
                                  </div>
                                </TableCell>
                                <TableCell className="relative px-1">
                                  <div className="flex flex-col">
                                    {isQc() && <p className="ml-2 text-green-900 font-bold" >{getItemData(index, "dimension") || <span className="text-transparent">d</span>}</p>}
                                    <AccountsInputWrapper label={`${index}-Dimension`} value={item.dimension || ""} identifier={"dimension"} isItem={true} itemIndex={index} >
                                      <Input className={cn(
                                        {
                                          " border-2 border-red-700": isItemMisMatch(item.dimension, getItemData(index, "dimension"), getItemTabIndex(index + 9))
                                        },
                                        {
                                          " shadow-sm shadow-red-500 text-red-700 font-semibold": renderErr(`${index}-dimension`),
                                        },
                                        " focus:bg-blue-100  dark:focus:bg-slate-800 focus-visible:ring-offset-0 focus-visible:ring-0  "
                                      )} disabled={requesting} value={item.dimension}
                                        onChange={(e) => hanleOnItemChange(e.target.value, index, "dimension")}
                                        onKeyDown={(e) => handleItemKeyPress(e, index, "dimension")}
                                        tabIndex={getItemTabIndex(index + 9)}
                                      />
                                      {renderErr(`${index}-dimension`)}
                                    </AccountsInputWrapper>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>

                        </Table>

                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ResizablePanel>


            </ResizablePanelGroup>


          </main>

          <footer className="flex fixed w-full text-gray-400 dark:bg-slate-900   mt-3 justify-center text-xs bg-gray-200 p-[.6rem] bottom-0">
            © 2024 DDCIC PHIL. All rights reserved.
          </footer>
        </div>
      </div>

    </div>

  )
}
