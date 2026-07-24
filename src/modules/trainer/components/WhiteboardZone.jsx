import { useState, useRef, useEffect, useCallback } from 'react';
import { getData } from "../../../services/api/getData";
import { postData } from "../../../services/api/postData";
import { deleteData } from "../../../services/api/deleteData";

const TOOLS = { PEN: 'pen', ERASER: 'eraser', RECT: 'rect', CIRCLE: 'circle', TEXT: 'text' };

export default function WhiteboardZone({ sessionId = 'session_101' }) {
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState('#0f172a');
  const [size, setSize] = useState(4);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPath = useRef([]);

  // Check role from localStorage to safely control deletion UI
  const userRole = (localStorage.getItem('user_role') || 'Student').toLowerCase();
  const canClearBoard = userRole === 'trainer' || userRole === 'teacher' || userRole === 'admin';

  // Render individual drawing shapes onto 2D Context
  const drawItem = useCallback((d) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    const { data, type, color: strokeColor, width } = { 
      data: d.drawing_data, 
      type: d.tool_type, 
      color: d.color, 
      width: d.stroke_width || 4 
    };
    
    if (!data) return;

    ctx.save();
    ctx.strokeStyle = strokeColor || '#0f172a';
    ctx.fillStyle = strokeColor || '#0f172a';
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = type === 'eraser' ? 'destination-out' : 'source-over';

    if (type === 'text') {
      ctx.font = '20px sans-serif';
      ctx.fillText(data.text || '', data.x || 0, data.y || 0);
    } else if (type === 'rect') {
      ctx.strokeRect(data.x || 0, data.y || 0, data.w || 0, data.h || 0);
    } else if (type === 'circle') {
      ctx.beginPath();
      ctx.arc(data.x || 0, data.y || 0, data.r || 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (data.path && data.path.length > 0) {
      ctx.beginPath();
      ctx.moveTo(data.path[0].x, data.path[0].y);
      data.path.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }
    ctx.restore();
  }, []);

  // Fetch canvas data and repaint
  const loadCanvasData = useCallback(async () => {
    try {
      const drawings = await getData(`/api/whiteboard/${sessionId}/`);
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Array.isArray(drawings)) {
        drawings.forEach(d => drawItem(d));
      }
    } catch (err) {
      console.error("Failed loading whiteboard data:", err);
    }
  }, [sessionId, drawItem]);

  // Handle Canvas Resizing & Context initialization
  const updateCanvasBounds = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctxRef.current = ctx;
      
      loadCanvasData();
    }
  }, [loadCanvasData]);

  useEffect(() => {
    updateCanvasBounds();

    // Listen for browser window resizes to maintain sharp canvas resolution
    window.addEventListener('resize', updateCanvasBounds);
    return () => window.removeEventListener('resize', updateCanvasBounds);
  }, [updateCanvasBounds]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    startPos.current = { x: offsetX, y: offsetY };
    currentPath.current = [{ x: offsetX, y: offsetY }];
    
    if (tool === TOOLS.TEXT) {
      const text = prompt("Enter text:");
      if (text && text.trim()) {
        postData('/api/whiteboard/save/', { 
          session_id: sessionId, 
          drawing_data: { text: text.trim(), x: offsetX, y: offsetY }, 
          tool_type: 'text', 
          color, 
          stroke_width: size 
        }).then(loadCanvasData);
      }
      return;
    }
    isDrawing.current = true;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    
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
    if (tool === TOOLS.RECT) {
      drawing_data = { x: startPos.current.x, y: startPos.current.y, w: offsetX - startPos.current.x, h: offsetY - startPos.current.y };
    } else if (tool === TOOLS.CIRCLE) {
      drawing_data = { x: startPos.current.x, y: startPos.current.y, r: Math.abs(offsetX - startPos.current.x) };
    } else {
      drawing_data = { path: currentPath.current };
    }

    try {
      await postData('/api/whiteboard/save/', { 
        session_id: sessionId, 
        drawing_data, 
        tool_type: tool, 
        color, 
        stroke_width: size 
      });
      loadCanvasData();
    } catch (err) {
      console.error("Error saving shape stroke:", err);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear the whiteboard?")) return;

    try {
      await deleteData(`/api/whiteboard/${sessionId}/`);
      
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      loadCanvasData();
    } catch (err) {
      alert(err.response?.data?.error || "Only Trainers or Admins are allowed to clear the whiteboard.");
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-50 p-3 overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-white p-2 rounded-xl border border-slate-200/80 shadow-sm shrink-0">
        
        {/* Tool Selector Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.values(TOOLS).map(t => (
            <button 
              key={t} 
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                tool === t ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`} 
              onClick={() => setTool(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Customization Options */}
        <div className="flex items-center gap-2">
          {/* Stroke Size Selector */}
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="text-xs bg-slate-100 border border-slate-200 font-medium rounded-lg px-2 py-1 outline-none cursor-pointer text-slate-700"
            title="Stroke Width"
          >
            <option value={2}>2px</option>
            <option value={4}>4px</option>
            <option value={8}>8px</option>
            <option value={12}>12px</option>
          </select>

          {/* Stroke Color Picker */}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer"
            title="Stroke Color"
          />

          {/* Clear Canvas Action (Shown for Trainers & Admins) */}
          {canClearBoard && (
            <button 
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer active:scale-95" 
              onClick={handleClear}
            >
              Clear Canvas
            </button>
          )}
        </div>
      </div>

      {/* HTML5 Canvas Surface */}
      <canvas 
        ref={canvasRef} 
        className="flex-1 w-full bg-white border border-slate-200/80 rounded-xl shadow-inner cursor-crosshair min-h-0" 
        onMouseDown={startDrawing} 
        onMouseMove={draw} 
        onMouseUp={stopDrawing} 
      />
    </div>
  );
}