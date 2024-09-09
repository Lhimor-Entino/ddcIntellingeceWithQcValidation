
// import './App.css'
import { HomePage } from "./MyComponents/HomePage"

import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./MyComponents/Login";
import { API_BASE_URL, coookie_options, request_cookie_options } from "./config";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { changeRequestProperty, changeSavingStatus, setRequestingStatus } from "./reducers/requestReducer";
import { toast as sonnerToast } from 'sonner'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import FailedRequestAlertModal from "./MyComponents/Modals/FailedRequestAlertModal";
import { StatusModal } from "./MyComponents/Modals/StatusModal";
import { SmallScreenViewModal } from "./MyComponents/Modals/SmallScreenViewModal";
import ReloadPageConfirmationModal from "./MyComponents/Modals/ReloadPageConfirmationModal";
import useValidation, { useItemValidation } from "@/hooks/validator"
import { changeData } from "./reducers/originalRequestDataReducer";
import { emptyError } from "./reducers/validationReducer";
import useAuthValidatorAlerts from "./hooks/authValidatorAlerts";
import { cn } from "./lib/utils";
import SeparateTabImageViewer from "./MyComponents/SeparateTabImageViewer";
import RejectEntryModal from "./MyComponents/Modals/RejectEntryModal";
import PageNotFound from "./MyComponents/PageNotFound";
import LogoutModal from "./MyComponents/Modals/LogoutModal";
import { SavingModal } from "./MyComponents/Modals/SavingModal";
import { changeOcrProperty } from "./reducers/OCRDataReducer";




const api = axios.create({ baseURL: API_BASE_URL });
function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { tokenExpired } = useAuthValidatorAlerts();
  const { validateData } = useValidation()
  const { validateItems } = useItemValidation()

  const elementRef = useRef(null);
  const validation_data = useSelector((state: any) => state.validation_Reducer);
  const [requestFailed, setRequestFailed] = useState<boolean>(false)
  const [smallScreenView, setSmallScreenView] = useState<boolean>(false)
  const request_data = useSelector((state: any) => state.request_reducer);
  const request_mode: boolean = useMemo(() => request_data.auto_request, [request_data]);
  // const [request_mode, setRequestMode] = useState<boolean>(false)
  const requesting = useMemo(() => request_data.requesting, [request_data]);
  const saving = useMemo(() => request_data.saving, [request_data]);
  const [errorReqMsg, setErrReqMsg] = useState<any>(null);
  const [reload, setReload] = useState<boolean>(false)
  const [errorOn, setErrorOn] = useState<number>(0)
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false)
  const [loggingOut, setLoggingOut] = useState<boolean>(false)
  const view_data = useSelector((state: any) => state.view_reducer);
  const [showImageViewer, setShowImageViewer] = useState<boolean>(false)
  const [reloadingImg, setReloadingImg] = useState<boolean>(false)
  const [saveTime, setSaveTime] = useState<string>("")
  // VARIABLE REFERENCE
  const requestDataRef = useRef(request_data);
  const saveTimeRef = useRef(saveTime);
  const requestModeRef = useRef(request_mode);
  const savingRef = useRef(saving);
  const requestingRef = useRef(requesting);

  const validationRef = useRef(validation_data)
  const viewRef = useRef(smallScreenView)
  const imgRef = useRef(showImageViewer)


  useEffect(() => {
    requestDataRef.current = request_data;
    requestModeRef.current = request_data.auto_request;
    savingRef.current = request_data.saving;
    validationRef.current = validation_data.errors;
  }, [request_data]);

  useEffect(() => {
    validationRef.current = validation_data.errors;
  }, [validation_data])

  // ACTIONS


  useEffect(() => {
    // Define the event handler
    const handleKeyDown = (event: KeyboardEvent) => {

      if (viewRef.current === true || savingRef.current === true || requestingRef.current === true) {
        event.preventDefault()
        return
      }


      if (event.key === 'F1') {

        // Prevent the default action (if needed)
        if (location.pathname.includes("tabViewer")) {
          sonnerToast.error("Alert", {
            description: 'Please request in entry window.',
          })
          return
        }
        event.preventDefault();

        isReadyForRequest()

      }

      if (event.altKey && event.key === "1" || event.altKey && event.key === "2") {
        event.preventDefault();
        if (!Cookies.get("role")) {
          console.log("no role")
          return
        }
        if (Cookies.get("role") !== "ROLE_QC" &&  Cookies.get("role") !== "ROLE_AUDITOR") return
        if(!Cookies.get("request_ocr_json")) return false

        let tabIndexes = null
        if(Cookies.get("tabIndex")){
          tabIndexes = JSON.parse(Cookies.get("tabIndex") || "")
        }else{
          tabIndexes = null
        }
        

        // Remove duplicates by converting the array to a Set
        const tabIndexOrder = Array.from(new Set(tabIndexes));

        // Sort the array in ascending order
        tabIndexOrder.sort((a: any, b: any) => a - b);

        console.log(tabIndexOrder)
        // Prevent the default action (if needed)
      
        const focusableElements = 'input';
        const elements = Array.from(document.querySelectorAll(focusableElements)) as HTMLElement[];

        const currentElement = document.activeElement as HTMLElement | null;


        if (currentElement && elements.includes(currentElement)) {
          currentElement.style.color = ""
          currentElement.style.fontWeight = ""
          const current_tabIndex = currentElement.getAttribute('tabindex') || "0";

          console.log("current", current_tabIndex)
          const index_in_tab_list = tabIndexOrder.indexOf(parseInt(current_tabIndex)) + 1;
          const nextTabIndex = tabIndexOrder[index_in_tab_list];
          console.log("nextTabIndex", nextTabIndex)
          const nextElement = elements.find(el => parseInt(el.getAttribute('tabindex') || '0', 10) === nextTabIndex);
          nextElement?.focus()
          if (!nextElement) return
          nextElement.style.color = "red"
          nextElement.style.fontWeight = "bold"
        } else {
          // If no current element or it's not in the list, focus the first element
          if (elements.length > 0) {
            elements[0]?.focus();
          }
        }
      }

      if (event.key === "F8") {
        event.preventDefault()
        return
      }

      if (event.key === "F2") {
        if (location.pathname.includes("tabViewer")) {
          sonnerToast.error("Alert", {
            description: 'Please save your progress in entry window.',
          })
          return
        }
        event.preventDefault();

        saveEntry()
      }
      if (event.key === "F3") {

        if (location.pathname.includes("tabViewer")) {
          sonnerToast.error("Alert", {
            description: 'Please save your progress in entry window.',
          })
          return
        }
        event.preventDefault();
        const filename = requestDataRef.current.request_info.details.document
        if (filename.length < 1) return
        setShowRejectModal(true)
        // rejecEntry()
      }
      if (event.key === "F4") {
        event.preventDefault()
        if (location.pathname.includes("tabViewer")) {
          sonnerToast.error("Alert", {
            description: 'Please reload image in entry window.',
          })
          return
        }
        event.preventDefault();
        const filename = requestDataRef.current.request_info.details.document
        if (filename.length < 1) return
        refetchImg()
        // rejecEntry()
      }
      if (event.ctrlKey && event.key === "F7") {

        if (location.pathname.includes("tabViewer")) {
          sonnerToast.error("Alert", {
            description: 'Please reload data in entry window.',
          })
          return
        }
        event.preventDefault();
        reloadData()
      }
      if (event.key === "F5") {
        event.preventDefault();
        setReload(true)
      }

    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getFutureTime = () => {
    // Create a new Date object for the current time
    const now = new Date();

    // Clone the Date object to avoid mutating the original
    const newTime = new Date(now.getTime());

    // Add 5 seconds to the new Date object
    newTime.setSeconds(newTime.getSeconds() + 5);

    // Set the future time in the state

    setSaveTime(newTime.toLocaleTimeString());
    saveTimeRef.current = newTime.toLocaleTimeString()
    return newTime.toLocaleTimeString()
  }

  // const getCurrentTime = () => {
  //   // Create a new Date object for the current time
  //   const now = new Date();

  //   // Clone the Date object to avoid mutating the original
  //   const newTime = new Date(now.getTime());

  //   // Add 5 seconds to the new Date object
  //   newTime.setSeconds(newTime.getSeconds());

  //   // Set the future time in the state

  //   return newTime.toLocaleTimeString()
  // }

  const rejecEntry = async (reason: string) => {
    try {
      const filename = requestDataRef.current.request_info.details.document
      const token = Cookies.get("jt")

      if (filename.length < 1) return

      const response = await api.get(`/document/reject/${filename}?reason=${reason}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Authorization header
          'Content-Type': 'application/json' // Set content type if needed
        }

      })


      if (response.data) {
        Cookies.remove("request_json")
        Cookies.remove("request_info")
        Cookies.remove("img_urls")
        Cookies.remove("original_request_data")

        dispatch(changeSavingStatus({ newValue: false }))
        savingRef.current = false

        if (requestModeRef.current) {
          isReadyForRequest()
        }
        else {

          const request_info = { newValue: {}, property: "request_info" };
          const img_urls = { newValue: [], property: "img_urls" };
          const request_json = { newValue: {}, property: "request_json" };

          dispatch(changeRequestProperty(request_info))
          dispatch(changeRequestProperty(img_urls))
          dispatch(changeRequestProperty(request_json))
          // dispatch(changeVerifiedProperty(request_json))
          dispatch(changeData(request_json))
        }


      }


    } catch (error) {

    }
  }

  //   function parseTime(timeStr:string) {
  //     const [time, period] = timeStr.split(' ');
  //     const [hours, minutes, seconds] = time.split(':').map(Number);

  //     // Convert 12-hour time to 24-hour time
  //     const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 :
  //                           period === 'AM' && hours === 12 ? 0 : hours;

  //     // Create a date object for comparison
  //     return new Date(1970, 0, 1, adjustedHours, minutes, seconds);
  // }
  const saveEntry = async () => {

    // const r_cookie = Cookies.get("request_ts") || ""
    // const request_time = parseTime(r_cookie)
    // const c_time = parseTime(getCurrentTime())
    // if (c_time < request_time ) {
    //   sonnerToast.error("Can't save  document", {
    //     description: 'You can save it after 5 seconds',
    //   })

    //   return
    // }

    if (JSON.stringify(requestDataRef.current.request_json) === "{}") {
      sonnerToast.error("Can't save blank document", {
        description: 'If you are sure that the document is blank, please reject (BLANK ORC).',
      })
      return
    }

    if (validationRef.current.length > 0) {
      sonnerToast.error("Can't save document", {
        description: 'Please fill in all red-marked fields with valid data.',
      })
      return
    }
    dispatch(changeSavingStatus({ newValue: true }))
    savingRef.current = true
    if (!Cookies.get("request_info")) {

      const request_info = { newValue: {}, property: "request_info" };
      const img_urls = { newValue: [], property: "img_urls" };
      const request_json = { newValue: {}, property: "request_json" };

      dispatch(changeRequestProperty(request_info))
      dispatch(changeRequestProperty(img_urls))
      dispatch(changeRequestProperty(request_json))
      dispatch(changeSavingStatus({ newValue: false }))
      //dispatch(changeVerifiedProperty(request_json))
      dispatch(changeData(request_json))
      savingRef.current = false

      return;
    }
    const token = Cookies.get("jt")
    const filename = requestDataRef.current.request_info.details.document

    const formData = requestDataRef.current.request_json
    try {

      const response = await api.post(
        `/document/save/${filename}`,
        formData, // Data to be sent in the request body
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Authorization header
            'Content-Type': 'application/json' // Set content type if needed
          }
        }
      );

      if (response.data) {
        Cookies.remove("request_json")
        Cookies.remove("request_info")
        Cookies.remove("img_urls")
        Cookies.remove("original_request_data")
        Cookies.remove("request_ocr_json")
        Cookies.remove("tabIndex")
        dispatch(changeSavingStatus({ newValue: false }))
        savingRef.current = false

        if (requestModeRef.current) {
          const request_json = { newValue: {}, property: "request_json" };
          dispatch(changeData(request_json))
          dispatch(changeOcrProperty(request_json))
     
          isReadyForRequest()
    
        }
        else {

          const request_info = { newValue: {}, property: "request_info" };
          const img_urls = { newValue: [], property: "img_urls" };
          const request_json = { newValue: {}, property: "request_json" };
         
          dispatch(changeRequestProperty(request_info))
          dispatch(changeRequestProperty(img_urls))
          dispatch(changeRequestProperty(request_json))
          //     dispatch(changeVerifiedProperty(request_json))
          dispatch(changeData(request_json))
          dispatch(changeOcrProperty(request_json))

        }



      }
    } catch (error: any) {
      console.log(error)

      if (error.response?.data.status == "403") {
        tokenExpired()
      }
      else if (error.response?.data.status == "400") {

        Cookies.remove("img_urls", coookie_options)
        Cookies.remove("original_request_data", coookie_options)
        Cookies.remove("request_info", coookie_options)
        Cookies.remove("request_json", coookie_options)

        // sonnerToast.info(error.response.data.details, {
        //   description: 'The system automatically requests new data.',
        //   duration: 2000
        // })
        setErrorOn(1)
        setErrReqMsg(error.response.data)
        setRequestFailed(true)
        // isReadyForRequest()

        // setErrorOn(1)
        // alert("error here")
        // setErrReqMsg(error.response.data)

      } else {
        sonnerToast.error('Cant connect to server', {
          description: 'Error connection timeout',
          duration: 3000
        })
      }
    } finally {

      dispatch(changeSavingStatus({ newValue: false }))
      savingRef.current = false


    }



  }

  const isReadyForRequest = () => {
    if (Cookies.get("request_info")) {
      sonnerToast.error('You have a pending request', {
        description: 'Please finished it and request again',
      })
    } else {
      handleRequestEntry()
    }
  }

  const refetchImg = async (filename_?: string) => {
    const response_info = JSON.parse(Cookies.get("request_info") || "")
    const token = Cookies.get("jt")
    const client = Cookies.get("client")
    if (!response_info) return
    setReloadingImg(true)
    const filename = filename_ || response_info.details.document
    try {
      const response2 = await api.get(`/document/get-image/${client}/${filename}/${1}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: "blob",
      })


      const blob = new Blob([response2.data], { type: "jpg" });
      const url = URL.createObjectURL(blob);
      const img_urls = { newValue: [url], property: "img_urls" };

      dispatch(changeRequestProperty(img_urls))
      Cookies.set("img_urls", JSON.stringify(img_urls), coookie_options)
      setReloadingImg(false)
    } catch (error: any) {
      console.log(error)

      tokenExpired()

    }

  }

  const reloadData = () => {
    const request_info = JSON.parse(Cookies.get("request_info") || "")
    const img_urls = JSON.parse(Cookies.get("img_urls") || "");
    const request_json = JSON.parse(Cookies.get("request_json") || "")
    const original_request_json = JSON.parse(Cookies.get("original_request_data") || "")
    const request_info_ = { newValue: request_info, property: "request_info" };
    dispatch(changeRequestProperty(request_info_))
    dispatch(changeRequestProperty(img_urls))
    dispatch(changeRequestProperty(request_json))
    //      dispatch(changeVerifiedProperty(request_json))
    dispatch(changeData(original_request_json))
  }
  const handleRequestEntry = async () => {
    if (!Cookies.get("jt")) return;

    setRequestFailed(false)

    const token = Cookies.get("jt")

    if (Cookies.get("request_info")) {

      const request_info = JSON.parse(Cookies.get("request_info") || "")
      const img_urls = JSON.parse(Cookies.get("img_urls") || "");
      const request_json = JSON.parse(Cookies.get("request_json") || "")
      const original_request_json = JSON.parse(Cookies.get("original_request_data") || "")
      const request_info_ = { newValue: request_info, property: "request_info" };


      if (Cookies.get("request_ocr_json")) {
        const request_ocr_json = JSON.parse(Cookies.get("request_ocr_json") || "")
        dispatch(changeOcrProperty(request_ocr_json))
      }

      dispatch(changeRequestProperty(request_info_))
      dispatch(changeRequestProperty(img_urls))
      dispatch(changeRequestProperty(request_json))


      //  dispatch(changeVerifiedProperty(request_json))
      dispatch(changeData(original_request_json))
    } else {
      try {
        dispatch(setRequestingStatus({ newValue: true }))
        requestingRef.current = true

        const response1 = await api.get(
          `/document/request`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const client = Cookies.get("client")
        const filename = response1.data.details.document
        const response2 = await api.get(`/document/get-image/${client}/${filename}/${1}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: "blob",
        })

        const blob = new Blob([response2.data], { type: "jpg" });
        const url = URL.createObjectURL(blob);

        let request_json: any = "";

        if (Cookies.get("role") === "ROLE_QC") {

          const response3 = await api.get(`/document/get-verified-data/${client}/${filename}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          request_json = { newValue: response3.data, property: "request_json" };

          const response4 = await api.get(`/document/get-ocr-data/${client}/${filename}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          const request_ocr_json = { newValue: response4.data, property: "request_json" };
          Cookies.set("request_ocr_json", JSON.stringify(request_ocr_json), coookie_options)
          dispatch(changeOcrProperty(request_ocr_json))

        } else {

          const response3 = await api.get(`/document/get-ocr-data/${client}/${filename}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          request_json = { newValue: response3.data, property: "request_json" };
        }

        await api.get(`/document/start-process/${filename}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
      
        })

        const request_info = { newValue: response1.data, property: "request_info" };
        const img_urls = { newValue: [url], property: "img_urls" };



        dispatch(changeRequestProperty(request_info))
        dispatch(changeRequestProperty(img_urls))
        dispatch(changeRequestProperty(request_json))


        dispatch(changeData(request_json))
        //dispatch(changeRequestProperty(request_json_))
        Cookies.set("request_info", JSON.stringify(response1.data), coookie_options)
        Cookies.set("img_urls", JSON.stringify(img_urls), coookie_options)
        Cookies.set("request_json", JSON.stringify(request_json), coookie_options)
        Cookies.set("original_request_data", JSON.stringify(request_json), coookie_options)
        Cookies.set("image_expiration", imageExpireTime(), coookie_options)
        Cookies.set("request_ts", getFutureTime(), request_cookie_options)

        refetchImg(filename)
      } catch (error: any) {
        console.log("here", error)

        if (error.response.data instanceof Blob) {
          const errorMessage = await error.response.data.text(); // Convert the blob to text
          console.error('Error message:', errorMessage);
          setErrReqMsg(JSON.parse(errorMessage))
        } else {
          setErrReqMsg(error.response.data)
        }
        setRequestFailed(true)

        if (error.response.data.status == "403") {
          tokenExpired()
        }
      } finally {
        dispatch(setRequestingStatus({ newValue: false }))
        requestingRef.current = false
      }
    }

  }
  const hasPendingRequest = () => {
    if (Cookies.get("request_info")) return true;

    return false
  }
  const imageExpireTime = () => {
    const now = new Date();
    const newTime = new Date(now.getTime() + 30 * 60000);

    return newTime.toLocaleString('en-GB', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(',', '');

  };
  // REFETCH IMAGE EVERY 30 MINS
  useEffect(() => {

    const timeoutDuration = 30 * 60 * 1000; // 30 minutes
    const timer = setTimeout(() => {
      refetchImg()
    }, timeoutDuration);
    return () => clearTimeout(timer);
  }, []);

  function formatToISO8601(dateString: string) {
    // Use a regular expression to extract components from the date string
    const match = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
    if (!match) {
      throw new Error('Invalid date format');
    }

    // Extract the components
    const [, day, month, year, hours, minutes, seconds] = match;

    // Construct the ISO 8601 format string
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }


  useEffect(() => {
    const image_expiration = Cookies.get("image_expiration")
    if (!image_expiration) return;
    const imageExpirationDate = new Date(formatToISO8601(image_expiration));
    const now = new Date();
    if (now >= imageExpirationDate) {
      refetchImg()
    }
  }, []);


  const logout = () => {
    if (!Cookies.get("request_info")) {
      Cookies.remove("jt")
      Cookies.remove("image_expiration")
      Cookies.remove("img_urls")
      Cookies.remove("original_request_data")
      Cookies.remove("request_info")
      Cookies.remove("request_json")
      Cookies.remove("user")
      Cookies.remove("role")
      navigate("login")
      return
    }
    setLoggingOut(true)
  }


  useEffect(() => {
    console.log(requestDataRef.current)
  }, [request_data])

  useEffect(() => {

    if (viewRef.current) {
      document.body.style.zoom = "100%";
    } else {

      document.body.style.zoom = "80%";
    }


  }, [viewRef.current])
  useEffect(() => {
    setShowImageViewer(view_data.showImageViewer)
    imgRef.current = view_data.showImageViewer
  }, [view_data])
  //  WATCH WINDDW  SIZE CHANGE AND SETS THE ELEMENT 80% FOR BETTER VIEWING
  useLayoutEffect(() => {


    const handleResize = () => {
      document.body.style.zoom = "80%"; // SET TO 80%
      if (elementRef.current) {
        const { offsetWidth } = elementRef.current;

        if (location.pathname.includes("tabViewer")) return;
        if (imgRef.current) {
          if (offsetWidth <= 1400) {
            setSmallScreenView(true)
            viewRef.current = true
            document.body.style.zoom = "100%";
          } else {
            setSmallScreenView(false)
            viewRef.current = false
            document.body.style.zoom = "80%";
          }
        }
      }
    };

    // Attach the resize event listener
    window.addEventListener('resize', handleResize);

    // Run the handleResize function initially to set dimensions
    handleResize();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); //


  useEffect(() => {

    // if(reloadRef.current === true) return;

    const beforeUnloadHandler = (event: any) => {
      event.preventDefault();
      event.returnValue = "Data will be lost if you leave the page, are you sure?";
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  // HIDE BROWSER DEFAULT CONTEXT MENU ON RIGHT CLICK
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevents the default context menu from appearing
  };

  // PERFORM AUTO VALIDATION
  useEffect(() => {

    if (!validation_data.isValidationOn) {

      dispatch(emptyError())
      return
    }
    if (JSON.stringify(request_data.request_json) !== "{}") {
      validateData(request_data)

    }
    if (JSON.stringify(request_data.request_json) !== "{}") {
      if (request_data.request_json.items?.length > 0) {

        validateItems(request_data)
      }
    }
  }, [request_data, validation_data.isValidationOn])

  return (
    <div ref={elementRef} onContextMenu={handleContextMenu} className={cn(smallScreenView ? "overflow-hidden" : "")} >
      <LogoutModal loggingOut={loggingOut} setLoggingOut={setLoggingOut} api={api} filename={requestDataRef.current.request_info.details?.document} />
      <RejectEntryModal reject={rejecEntry} showRejectModal={showRejectModal} setShowRejectModal={setShowRejectModal} />
      {/* <img  src="" ref={smRef} style={{width: "800px", height:"300px"}}/> */}
      {reload && <ReloadPageConfirmationModal setReload={setReload} />}
      {smallScreenView && <SmallScreenViewModal />}
      {/* {savingRef.current === true ? <StatusModal message="Saving your progress" /> : ""} */}
      {savingRef.current === true ? <SavingModal /> : ""}
      {requestingRef.current === true ? <StatusModal message="Requesting for entry" /> : ""}
      {requestFailed && <FailedRequestAlertModal errMsg={errorReqMsg} handleRequestEntry={handleRequestEntry} setRequestFailed={setRequestFailed} errorOn={errorOn} />}
      {/* {savingRef.current === true && toast('Event has been created')} */}
      <Routes>
        <Route path="/" element={<HomePage savingRef={savingRef} reloadData={reloadData} reloadingImg={reloadingImg} api={api} handleRequestEntry={handleRequestEntry} isReadyForRequest={isReadyForRequest} saveEntry={saveEntry} logout={logout} hasPendingRequest={hasPendingRequest} setShowRejectModal={setShowRejectModal} refetchImg={refetchImg} />} />
        <Route path="login" element={<Login api={api} />}></Route>
        <Route path="tabViewer/:img?" element={<SeparateTabImageViewer />}></Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </div>
  )
}

export default App
