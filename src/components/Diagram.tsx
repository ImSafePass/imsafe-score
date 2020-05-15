import React, { useState, useRef, useEffect } from "react";

const Diagram = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (ref && ref.current) {
      const newWidth = ref.current.parentElement?.offsetWidth;
      if (newWidth) setWidth(newWidth);
      const c = ref.current.getContext("2d");

      if (c && width) {
        c.beginPath();
        c.moveTo(width / 2, 10);
        c.lineTo(width - 10, 10);
        c.stroke();

        c.arc(width - 10, 10, 10, 0, Math.PI / 4, true);
      }
    }
  }, [ref, width]);

  return <canvas width={width} height={200} ref={ref}></canvas>;
};

export default Diagram;
