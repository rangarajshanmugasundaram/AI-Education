import { useState, useRef, useEffect } from 'react';
import { getData } from '../../auth/components/API/getData';
import { postData } from '../../auth/components/API/postData';
import { deleteData } from '../../auth/components/API/deleteData';

const TOOLS = { PEN: 'pen', ERASER: 'eraser', RECT: 'rect', CIRCLE: 'circle', TEXT: 'text' };

export default function WhiteboardCollaborationHub({ sessionId = 'session_101' }) {
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState('#0f172a');
  const [size, setSize] = useState(4);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPath = useRef([]); // Tracks points for pen/eraser

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctxRef.current = canvas.getContext('2d');
    ctxRef.current.lineCap = 'round';
    ctxRef.current.lineJoin = 'round';
    loadCanvasData();
  }, [sessionId]);

  const loadCanvasData = async () => {
    const drawings = await getData(`/api/whiteboard/${sessionId}/`);
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawings.forEach(d => drawItem(d));
  };

  const drawItem = (d) => {
    const ctx = ctxRef.current;
    const { data, type, color, width } = { data: d.drawing_data, type: d.tool_type, color: d.color, width: d.stroke_width };
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.globalCompositeOperation = type === 'eraser' ? 'destination-out' : 'source-over';

    if (type === 'text') {
      ctx.font = '20px sans-serif';
      ctx.fillText(data.text, data.x, data.y);
    } else if (type === 'rect') {
      ctx.strokeRect(data.x, data.y, data.w, data.h);
    } else if (type === 'circle') {
      ctx.beginPath();
      ctx.arc(data.x, data.y, data.r, 0, Math.PI * 2);
      ctx.stroke();
    } else if (data.path && data.path.length > 0) {
      ctx.beginPath();
      ctx.moveTo(data.path[0].x, data.path[0].y);
      data.path.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }
    ctx.restore();
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    startPos.current = { x: offsetX, y: offsetY };
    currentPath.current = [{ x: offsetX, y: offsetY }];
    
    if (tool === TOOLS.TEXT) {
      const text = prompt("Enter text:");
      if (text) {
        postData('/api/whiteboard/save/', { session_id: sessionId, drawing_data: { text, x: offsetX, y: offsetY }, tool_type: 'text', color, stroke_width: size })
        .then(loadCanvasData);
      }
      return;
    }
    isDrawing.current = true;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    
    // Preview for Pen/Eraser
    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
      ctxRef.current.globalCompositeOperation = tool === TOOLS.ERASER ? 'destination-out' : 'source-over';
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = size;
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(currentPath.current[currentPath.current.length - 1].x, currentPath.current[currentPath.current.length - 1].y);
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
      currentPath.current.push({ x: offsetX, y: offsetY });
    }
  };

  const stopDrawing = async (e) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const { offsetX, offsetY } = e.nativeEvent;
    
    let drawing_data;
    if (tool === TOOLS.RECT) drawing_data = { x: startPos.current.x, y: startPos.current.y, w: offsetX - startPos.current.x, h: offsetY - startPos.current.y };
    else if (tool === TOOLS.CIRCLE) drawing_data = { x: startPos.current.x, y: startPos.current.y, r: Math.abs(offsetX - startPos.current.x) };
    else drawing_data = { path: currentPath.current };

    await postData('/api/whiteboard/save/', { session_id: sessionId, drawing_data, tool_type: tool, color, stroke_width: size });
    loadCanvasData();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4">
      <div className="flex gap-2 mb-4 bg-white p-2 rounded shadow">
        {Object.values(TOOLS).map(t => (
          <button key={t} className={`px-4 py-1 rounded capitalize ${tool === t ? 'bg-black text-white' : 'bg-gray-200'}`} onClick={() => setTool(t)}>
            {t}
          </button>
        ))}
        <button className="bg-red-500 text-white px-4 rounded" onClick={async () => { await deleteData(`/api/whiteboard/${sessionId}/`); loadCanvasData(); }}>CLEAR</button>
      </div>
      <canvas ref={canvasRef} className="flex-1 bg-white border shadow-inner cursor-crosshair" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} />
    </div>
  );
}