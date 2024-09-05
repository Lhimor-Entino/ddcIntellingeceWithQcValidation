import * as React from 'react';
import PanViewer from './ImageViewer';
import { Button } from '@/components/ui/button';
import { FlipHorizontal2Icon, Rotate3dIcon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

// box-shadow: 0px 0px 5px 1px #0c0c0c;

type ReactPanZoomProps = {
  image: string;
  alt?: string;
  ref?: any;
};


const ReactPanZoom = ({ image, alt, ref }: ReactPanZoomProps) => {
  const [dx, setDx] = React.useState(0);
  const [dy, setDy] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [flip, setFlip] = React.useState(false);

  const rotationRef = React.useRef(rotation);
  const flipRef = React.useRef(flip);
  const zoomRef = React.useRef(zoom);
  const resetAll = () => {
    setDx(0);
    setDy(0);
    setZoom(1);
    setRotation(0);
    setFlip(false);
    rotationRef.current = 0
    flipRef.current = false
    zoomRef.current = 1
  };
  const zoomIn = () => {
    const new_z = zoomRef.current + 0.2
    setZoom(new_z);
    zoomRef.current = new_z
  };

  const zoomOut = () => {
    if (zoomRef.current >= 1) {

      const new_z =zoomRef.current - 0.2
      setZoom(new_z);
      zoomRef.current = new_z

    }
  };

  const rotateLeft = () => {
    if (rotation === -3) {
      setRotation(0);
      rotationRef.current = 0
    } else {

      let rot = rotationRef.current - 1
      rotationRef.current = rot

      setRotation(rot);
    }
  };

  const flipImage = () => {
    setFlip(!flipRef.current);
    flipRef.current = !flipRef.current
  };

  const onPan = (dx: number, dy: number) => {
    setDx(dx);
    setDy(dy);
  };
 

   // ACTIONS
   React.useEffect(() => {
    // Define the event handler
    const handleKeyDown = (event : KeyboardEvent) => {
    
    
      if (event.ctrlKey && event.key === 'l' || event.ctrlKey && event.key === 'L') {
        // Prevent the default action (e.g., page refresh)
         event.preventDefault();
        rotateLeft()
     
      }else  if (event.ctrlKey && event.key === 'f' || event.ctrlKey && event.key === 'F') {
        // Prevent the default action (e.g., page refresh)
         event.preventDefault();
         flipImage()
      }else  if (event.ctrlKey && event.key === 's' || event.ctrlKey && event.key === 'S') {
        // Prevent the default action (e.g., page refresh)
         event.preventDefault();
         resetAll()
      }else  if (event.ctrlKey && event.key === 'i' || event.ctrlKey && event.key === 'I') {
        // Prevent the default action (e.g., page refresh)
         event.preventDefault();
         zoomIn()
      }else  if (event.ctrlKey && event.key === 'o' || event.ctrlKey && event.key === 'O') {
        // Prevent the default action (e.g., page refresh)
         event.preventDefault();
         zoomOut()
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); 

  return (
    <div>
      <div className='absolute z-10 grid justify-end gap-1 py-2 right-2'>
        <Button variant={"outline"} size={"sm"} onClick={zoomIn}>
          <ZoomInIcon />
        </Button>
        <Button variant={"outline"} size={"sm"} onClick={zoomOut}>
          <ZoomOutIcon />
        </Button>
        <Button variant={"outline"} size={"sm"} onClick={rotateLeft}>
          <Rotate3dIcon />
        </Button>
        <Button variant={"outline"} size={"sm"} onClick={flipImage}>
          <FlipHorizontal2Icon />
        </Button>
        <Button variant={"outline"} size={"sm"} onClick={resetAll}>
          <RotateCcwIcon />
        </Button>
      </div>
      <PanViewer
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}
        zoom={zoom}
        setZoom={setZoom}
        pandx={dx}
        pandy={dy}
        onPan={onPan}
        rotation={rotation}
        key={dx} >
        <img
          style={{
            transform: `rotate(${rotation * 90}deg) scaleX(${flip ? -1 : 1})`,
            width: '100%',
           
          }}
          src={image}
          alt={alt}
          ref={ref}
        />
      </PanViewer>
    </div>
  );
};

export { PanViewer };
export default ReactPanZoom;