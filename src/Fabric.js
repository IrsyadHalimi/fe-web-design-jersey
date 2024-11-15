import React, { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric';

let newCanvas;
const JerseyDesign = () => {
  const canvasRef = useRef(null);
  const [design, setDesign] = useState(null);
  const [canvas, setCanvas] = useState(null);

  const initCanvas = () => {
    const newCanvas = new fabric.Canvas(canvasRef.current);
    newCanvas.setWidth(400);
    newCanvas.setHeight(600);
    return newCanvas;
  };

  // Menambahkan elemen ke canvas (misalnya warna dan logo)
  const addElementToCanvas = (canvas) => {
    const rect = new fabric.Rect({
      left: 50,
      top: 50,
      fill: '#00f',
      width: 200,
      height: 300,
    });
    canvas.add(rect);
  };

  const exportDesign = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      setDesign(dataURL);
    }
  };

  // Simpan desain ke backedn Laravel
  const saveDesign = async () => {
    if (design) {
      const response = await fetch('http://localhost:8000/save-jersey-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: design }),
      });

      const result = await response.json();
      console.log(result.message);
    }
  };

  // Menyiapkan canvas ketika komponen pertama kali dimuat
  useEffect(() => {
    const newCanvas = initCanvas();
    setCanvas(newCanvas);
    addElementToCanvas(newCanvas);

    return () => {
      newCanvas.dispose();
    };
}, []);

return (
  <div>
    <h1>Jersey Design</h1>
    <canvas ref={canvasRef}></canvas>
    <button onClick={exportDesign}>Export Design</button>
    {design && <img src={design} alt="Jersey Preview" />}
    <button onClick={saveDesign}>Save Design</button>
  </div>
  );
};

export default JerseyDesign;
