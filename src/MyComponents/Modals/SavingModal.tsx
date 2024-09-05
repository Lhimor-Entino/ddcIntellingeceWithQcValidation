import { StatusModal } from "./StatusModal"


export const SavingModal = () => {
  return (
    <div className="absolute overflow-hidden w-full h-screen items-center justify-center" style={{zIndex:60, height:"100%", backgroundColor: "rgba(0,0,0,0.3)"}}>
              
              <div className="mt-72 ml-0">
              <StatusModal message="Saving your progress" />
              </div>
               
    </div>
  )
}
