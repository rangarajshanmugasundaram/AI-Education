import { useState, useRef, useEffect, useCallback } from 'react';

const TOOLS = { PEN: 'pen', ERASER: 'eraser', TEXT: 'text' };

export default function WhiteboardCollaborationHub() {
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState('#0f172a');
  const [size, setSize] = useState(4);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, []);

  const startDrawing = useCallback((e) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = e.nativeEvent;
    
    if (tool === TOOLS.TEXT) {
      const text = prompt("Enter your text:");
      if (text) {
        ctxRef.current.fillStyle = color;
        ctxRef.current.font = "20px sans-serif";
        ctxRef.current.fillText(text, offsetX, offsetY);
      }
      isDrawing.current = false;
      return;
    }

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  }, [tool, color]);

  const draw = useCallback((e) => {
    if (!isDrawing.current || tool === TOOLS.TEXT) return;
    const { offsetX, offsetY } = e.nativeEvent;
    
    ctxRef.current.globalCompositeOperation = tool === TOOLS.ERASER ? 'destination-out' : 'source-over';
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = tool === TOOLS.ERASER ? size * 5 : size;
    
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  }, [tool, color, size]);

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
    ctxRef.current?.closePath();
  }, []);

  const clearCanvas = useCallback(() => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  return (
    <div className="wb-container">
      <header className="wb-header">
        <div className="wb-brand">
          <span className="live-pill">LIVE WORKSPACE</span>
          <span className="title">Whiteboard Collaboration Hub</span>
        </div>
        <button className="clear-btn" onClick={clearCanvas}>🗑️ Clear All</button>
      </header>

      <div className="wb-canvas-area">
        <div className="floating-toolbar">
          <div className="tool-group">
            {Object.values(TOOLS).map((t) => (
              <button key={t} className={tool === t ? 'active' : ''} onClick={() => setTool(t)}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className="swatch-group">
            {['#0f172a', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b'].map((c) => (
              <button key={c} className={`swatch ${color === c ? 'active' : ''}`} style={{ backgroundColor: c }} onClick={() => setColor(c)} />
            ))}
          </div>

          <div className="size-group">
            <span>Size:</span>
            <input type="range" min="2" max="20" value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </div>
        </div>

        <canvas 
          ref={canvasRef} 
          className="main-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <style>{`
        .wb-container { display: flex; flex-direction: column; height: 100vh; background: #f8fafc; font-family: system-ui, sans-serif; }
        .wb-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background: #fff; border-bottom: 1px solid #e2e8f0; }
        .wb-brand { display: flex; align-items: center; gap: 10px; }
        .live-pill { background: #22c55e; color: #fff; font-size: 8px; font-weight: 900; padding: 2px 6px; border-radius: 4px; }
        .title { font-size: 13px; font-weight: 700; color: #0f172a; }
        .clear-btn { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; }
        .wb-canvas-area { flex: 1; position: relative; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 24px 24px; cursor: crosshair; }
        .floating-toolbar { position: absolute; top: 15px; right: 20px; display: flex; align-items: center; gap: 12px; background: #fff; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); z-index: 10; }
        .tool-group { display: flex; gap: 4px; }
        .tool-group button { border: none; background: #f1f5f9; padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; color: #64748b; cursor: pointer; }
        .tool-group button.active { background: #0f172a; color: #fff; }
        .swatch-group { display: flex; gap: 6px; }
        .swatch { width: 18px; height: 18px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; }
        .swatch.active { border-color: #3b82f6; }
        .size-group { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #64748b; }
        .main-canvas { width: 100%; height: 100%; display: block; }
      `}</style>
    </div>
  );
}