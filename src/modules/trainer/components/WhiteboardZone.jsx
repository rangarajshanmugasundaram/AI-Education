import { useState, useEffect, useRef, useReducer, memo, useCallback } from 'react';

const TOOLS = { PEN: 'pen', ERASER: 'eraser', TEXT: 'text' };
const ACTION_TYPES = { 
  ADD_ELEMENT: 'ADD_ELEMENT', 
  SET_STICKIES: 'SET_STICKIES', 
  ADD_STICKY: 'ADD_STICKY', 
  UPDATE_STICKY: 'UPDATE_STICKY', 
  DELETE_STICKY: 'DELETE_STICKY', 
  CLEAR_COMPLETE_CANVAS: 'CLEAR_COMPLETE_CANVAS', 
  UNDO: 'UNDO', 
  REDO: 'REDO' 
};
const COLLAB_TABS = { CHAT: 'chat', HAND: 'hand', POLL: 'poll', QUIZ: 'quiz' };

const initialState = {
  elements: [],
  stickyNotes: [],
  history: [[]],
  historyIndex: 0
};

function whiteboardReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_ELEMENT: {
      const updatedElements = [...state.elements, action.payload];
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return { ...state, elements: updatedElements, history: [...newHistory, updatedElements], historyIndex: newHistory.length };
    }
    case ACTION_TYPES.SET_STICKIES:
      return { ...state, stickyNotes: action.payload };
    case ACTION_TYPES.ADD_STICKY:
      return { ...state, stickyNotes: [...state.stickyNotes, action.payload] };
    case ACTION_TYPES.UPDATE_STICKY:
      return { ...state, stickyNotes: state.stickyNotes.map(n => n.id === action.payload.id ? { ...n, ...action.payload.updates } : n) };
    case ACTION_TYPES.DELETE_STICKY:
      return { ...state, stickyNotes: state.stickyNotes.filter(n => n.id !== action.payload) };
    case ACTION_TYPES.CLEAR_COMPLETE_CANVAS: {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return { 
        ...state, 
        elements: [], 
        stickyNotes: [], 
        history: [...newHistory, []], 
        historyIndex: newHistory.length 
      };
    }
    case ACTION_TYPES.UNDO: {
      if (state.historyIndex <= 0) return state;
      return { ...state, elements: state.history[state.historyIndex - 1], historyIndex: state.historyIndex - 1 };
    }
    case ACTION_TYPES.REDO: {
      if (state.historyIndex >= state.history.length - 1) return state;
      return { ...state, elements: state.history[state.historyIndex + 1], historyIndex: state.historyIndex + 1 };
    }
    default:
      return state;
  }
}

const StickyNote = memo(({ note, onDragStart, onUpdate, onDelete }) => {
  return (
    <div 
      style={{ top: `${note.y}px`, left: `${note.x}px`, backgroundColor: note.color, position: 'absolute' }}
      className="sticky-note-node animate-fade-in"
      onPointerDown={(e) => onDragStart(e, note)}
    >
      <div className="sticky-drag-handle" />
      <div className="sticky-content">
        <textarea
          style={{ color: note.textColor }}
          value={note.text}
          onChange={(e) => onUpdate(note.id, e.target.value)}
        />
        <button onPointerDown={(e) => { e.stopPropagation(); onDelete(note.id); }} className="sticky-delete-btn">✕ Delete</button>
      </div>
    </div>
  );
});

StickyNote.displayName = 'StickyNote';

export default function WhiteboardCollaborationHub() {
  const staticCanvasRef = useRef(null);
  const activeCanvasRef = useRef(null);
  const containerRef = useRef(null);

  const [tool, setTool] = useState(TOOLS.PEN); 
  const [strokeColor, setStrokeColor] = useState('#0f172a'); 
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [activeCollabTab, setActiveCollabTab] = useState(COLLAB_TABS.CHAT);

  const [handRaised, setHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatList, setChatList] = useState([
    { id: 1, sender: 'System AI', msg: 'Welcome to your collaborative landscape session hub!' }
  ]);

  const [state, dispatch] = useReducer(whiteboardReducer, initialState, () => {
    try {
      const savedElements = localStorage.getItem('collab_engine_elements');
      const savedStickies = localStorage.getItem('collab_engine_stickies');
      const elements = savedElements ? JSON.parse(savedElements) : [];
      return { elements, stickyNotes: savedStickies ? JSON.parse(savedStickies) : [], history: [elements], historyIndex: 0 };
    } catch { return initialState; }
  });

  const isDrawingRef = useRef(false);
  const currentPathRef = useRef([]);
  const startCoordsRef = useRef({ x: 0, y: 0 });
  const draggingNoteRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const drawSingleElement = useCallback((ctx, el) => {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = el.color || '#0f172a';
    ctx.lineWidth = el.width || 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (el.tool === TOOLS.ERASER) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 36;
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }

    if (el.tool === TOOLS.PEN || el.tool === TOOLS.ERASER) {
      const points = el.points || [];
      if (points.length > 1) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.stroke();
      }
    } else if (el.tool === TOOLS.TEXT) { 
      ctx.font = '600 16px system-ui, sans-serif'; 
      ctx.fillStyle = el.color; 
      ctx.fillText(el.text || "", el.x, el.y + 6); 
    }
    ctx.restore();
  }, []);

  const renderStaticLayers = useCallback(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#e2e8f0';
    for (let x = 14; x < width; x += 24) {
      for (let y = 14; y < height; y += 24) { ctx.fillRect(x, y, 1.5, 1.5); }
    }
    state.elements.forEach(el => drawSingleElement(ctx, el));
  }, [state.elements, drawSingleElement]);

  useEffect(() => { 
    localStorage.setItem('collab_engine_elements', JSON.stringify(state.elements)); 
    renderStaticLayers(); 
  }, [state.elements, renderStaticLayers]);

  useEffect(() => { 
    localStorage.setItem('collab_engine_stickies', JSON.stringify(state.stickyNotes)); 
  }, [state.stickyNotes]);

  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      if (!container || !staticCanvasRef.current || !activeCanvasRef.current) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      [staticCanvasRef.current, activeCanvasRef.current].forEach(canvas => {
        canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
        canvas.style.width = '100%'; canvas.style.height = '100%';
        canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      });
      renderStaticLayers();
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [renderStaticLayers]);

  const getCanvasCoords = useCallback((clientX, clientY) => {
    if (!activeCanvasRef.current) return { x: 0, y: 0 };
    const rect = activeCanvasRef.current.getBoundingClientRect();
    const isMobilePortrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
    
    if (isMobilePortrait) {
      return {
        x: clientY - rect.top,
        y: rect.right - clientX
      };
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handlePointerDown = (e) => {
    if (e.target.tagName !== 'CANVAS') return;
    e.target.setPointerCapture(e.pointerId);
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    isDrawingRef.current = true;
    startCoordsRef.current = { x, y };
    if (tool === TOOLS.PEN || tool === TOOLS.ERASER) currentPathRef.current = [{ x, y }];
  };

  const handlePointerMove = (e) => {
    if (isDrawingRef.current) {
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      const ctx = activeCanvasRef.current.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, activeCanvasRef.current.width / dpr, activeCanvasRef.current.height / dpr);

      if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
        currentPathRef.current.push({ x, y });
        drawSingleElement(ctx, { tool, color: strokeColor, width: strokeWidth, points: currentPathRef.current });
      }
      return;
    }

    if (draggingNoteRef.current) {
      const id = draggingNoteRef.current;
      const isMobilePortrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
      
      dispatch({
        type: ACTION_TYPES.SET_STICKIES,
        payload: state.stickyNotes.map(n => {
          if (n.id !== id) return n;
          if (isMobilePortrait) {
            return {
              ...n,
              x: e.clientY - dragOffsetRef.current.x,
              y: (window.innerWidth - e.clientX) - dragOffsetRef.current.y
            };
          }
          return { ...n, x: e.clientX - dragOffsetRef.current.x, y: e.clientY - dragOffsetRef.current.y };
        })
      });
    }
  };

  const handlePointerUp = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      let finalElement = null;

      const activeCtx = activeCanvasRef.current.getContext('2d');
      activeCtx.clearRect(0, 0, activeCanvasRef.current.width, activeCanvasRef.current.height);

      if (tool === TOOLS.PEN || tool === TOOLS.ERASER) {
        if (currentPathRef.current.length > 0) finalElement = { tool, color: strokeColor, width: strokeWidth, points: currentPathRef.current };
      } else if (tool === TOOLS.TEXT) {
        const text = prompt("Write Text layer value:");
        if (text?.trim()) finalElement = { tool: TOOLS.TEXT, x: startCoordsRef.current.x, y: startCoordsRef.current.y, text: text.trim(), color: strokeColor };
      }

      if (finalElement) dispatch({ type: ACTION_TYPES.ADD_ELEMENT, payload: finalElement });
      currentPathRef.current = [];
    }
    draggingNoteRef.current = null;
  };

  const handleStickyDragStart = useCallback((e, note) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    draggingNoteRef.current = note.id;
    
    const isMobilePortrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
    if (isMobilePortrait) {
      dragOffsetRef.current = { x: e.clientY - note.x, y: (window.innerWidth - e.clientX) - note.y };
    } else {
      dragOffsetRef.current = { x: e.clientX - note.x, y: e.clientY - note.y };
    }
  }, []);

  const handleStickyUpdate = useCallback((id, text) => {
    dispatch({ type: ACTION_TYPES.UPDATE_STICKY, payload: { id, updates: { text } } });
  }, []);

  const handleStickyDelete = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.DELETE_STICKY, payload: id });
  }, []);

  const handleCanvasDoubleClick = (e) => {
    if (e.target.tagName !== 'CANVAS') return;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    dispatch({ type: ACTION_TYPES.ADD_STICKY, payload: { id: Date.now(), text: "Tap to write...", color: '#fef08a', textColor: '#713f12', x: x - 75, y: y - 75 } });
  };

  const handleClearAction = () => {
    if (window.confirm("Are you sure you want to clear the entire canvas? (This removes drawings AND sticky notes)")) {
      dispatch({ type: ACTION_TYPES.CLEAR_COMPLETE_CANVAS });
    }
  };

  const sendLiveChatMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatList([...chatList, { id: Date.now(), sender: 'Trainer (You)', msg: chatMessage.trim() }]);
    setChatMessage('');
  };

  return (
    <div className="collab-container force-landscape-rotation">
      <header className="collab-header">
        <div className="brand-group">
          <span className="live-pill">LIVE WORKSPACE</span>
          <h1>Whiteboard Collaboration Hub</h1>
        </div>
        <div className="history-actions">
          <button className="h-btn" onClick={() => dispatch({ type: ACTION_TYPES.UNDO })} disabled={state.historyIndex <= 0}>⤺ Undo</button>
          <button className="h-btn" onClick={() => dispatch({ type: ACTION_TYPES.REDO })} disabled={state.historyIndex >= state.history.length - 1}>⤻ Redo</button>
          <button className="clear-btn" onClick={handleClearAction}>🗑️ Clear Canvas</button>
        </div>
      </header>

      <div className="workspace-grid">
        <div className="canvas-column" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onDoubleClick={handleCanvasDoubleClick}>
          
          <div className="floating-toolbar">
            <div className="t-group">
              {Object.values(TOOLS).map((t) => (
                <button key={t} className={tool === t ? "t-btn active" : "t-btn"} onClick={() => setTool(t)}>{t.toUpperCase()}</button>
              ))}
            </div>

            {tool !== TOOLS.ERASER && (
              <div className="t-group">
                {['#0f172a', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b'].map((c) => (
                  <button key={c} className={strokeColor === c ? "swatch active" : "swatch"} onClick={() => setStrokeColor(c)} style={{ backgroundColor: c }} />
                ))}
              </div>
            )}

            {tool !== TOOLS.ERASER && tool !== TOOLS.TEXT && (
              <div className="t-group thickness-slider">
                <span>Size:</span>
                <input type="range" min="2" max="14" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} />
              </div>
            )}

            <div className="t-group">
              <button className="toolbar-clear-btn" onClick={handleClearAction} title="Clear Everything">
                🗑️ Clear All
              </button>
            </div>
          </div>

          <div className="canvas-frame" ref={containerRef} onPointerDown={handlePointerDown}>
            <canvas ref={staticCanvasRef} className="base-layer" />
            <canvas ref={activeCanvasRef} className="active-drawing-layer" style={{ cursor: tool === TOOLS.ERASER ? 'cell' : 'crosshair' }} />
            
            <div className="sticky-overlay-plane">
              {state.stickyNotes.map((note) => (
                <StickyNote key={note.id} note={note} onDragStart={handleStickyDragStart} onUpdate={handleStickyUpdate} onDelete={handleStickyDelete} />
              ))}
            </div>

            <div className="mobile-double-click-hint">💡 Double tap canvas to drop Sticky Notes</div>
          </div>
        </div>

        <aside className="collab-sidebar">
          <nav className="tab-navigation">
            <button className={activeCollabTab === COLLAB_TABS.CHAT ? 'tab-link active' : 'tab-link'} onClick={() => setActiveCollabTab(COLLAB_TABS.CHAT)}>Chat</button>
            <button className={activeCollabTab === COLLAB_TABS.HAND ? 'tab-link active' : 'tab-link'} onClick={() => setActiveCollabTab(COLLAB_TABS.HAND)}>Hand</button>
            <button className={activeCollabTab === COLLAB_TABS.POLL ? 'tab-link active' : 'tab-link'} onClick={() => setActiveCollabTab(COLLAB_TABS.POLL)}>Poll</button>
            <button className={activeCollabTab === COLLAB_TABS.QUIZ ? 'tab-link active' : 'tab-link'} onClick={() => setActiveCollabTab(COLLAB_TABS.QUIZ)}>Quiz</button>
          </nav>

          <div className="sidebar-viewport">
            {activeCollabTab === COLLAB_TABS.CHAT && (
              <div className="tab-pane-view flex-col">
                <div className="chat-messages-scroll">
                  {chatList.map(c => (
                    <div key={c.id} className="chat-bubble">
                      <strong className="block text-slate-700 text-[11px] mb-0.5">{c.sender}</strong>
                      <p className="text-slate-600 m-0 text-xs">{c.msg}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendLiveChatMessage} className="chat-input-row">
                  <input type="text" placeholder="Type message..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                  <button type="submit">Send</button>
                </form>
              </div>
            )}

            {activeCollabTab === COLLAB_TABS.HAND && (
              <div className="tab-pane-view centering">
                <button className={`raise-hand-trigger ${handRaised ? 'active' : ''}`} onClick={() => setHandRaised(!handRaised)}>
                  ✋ {handRaised ? 'Raised' : 'Raise Hand'}
                </button>
              </div>
            )}

            {activeCollabTab === COLLAB_TABS.POLL && (
              <div className="tab-pane-view spacing">
                <div className="poll-card">
                  <h4>Active Poll: Tracking well?</h4>
                  <div className="poll-option"><button onClick={() => alert('Yes')}>Yes, tracking well</button><span className="badge">74%</span></div>
                  <div className="poll-option"><button onClick={() => alert('No')}>Slow Down</button><span className="badge">26%</span></div>
                </div>
              </div>
            )}

            {activeCollabTab === COLLAB_TABS.QUIZ && (
              <div className="tab-pane-view spacing">
                <div className="quiz-card">
                  <span className="q-tag">Q1 Architecture</span>
                  <p className="q-text">Which hook manages localized complex state updates?</p>
                  <button className="q-ans-row" onClick={() => alert('No')}>useEffect()</button>
                  <button className="q-ans-row correct" onClick={() => alert('Yes!')}>useReducer()</button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        :root { --p-blue: #2563eb; --p-dark: #0f172a; --p-border: #e2e8f0; }
        .collab-container { display: flex; flex-direction: column; width: 100vw; height: 100vh; background-color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; box-sizing: border-box; }
        .collab-header { display: flex; justify-content: space-between; align-items: center; padding: 0 16px; background-color: #ffffff; border-bottom: 1px solid var(--p-border); height: 48px; box-sizing: border-box; flex-shrink: 0; }
        .brand-group { display: flex; align-items: center; gap: 8px; min-width: max-content; }
        .live-pill { font-size: 8px; font-weight: 900; background-color: #22c55e; color: white; padding: 2px 5px; border-radius: 4px; }
        .collab-header h1 { font-size: 13px; font-weight: 700; color: var(--p-dark); margin: 0; }
        .history-actions { display: flex; gap: 6px; flex-shrink: 0;}
        .h-btn { padding: 4px 8px; font-size: 11px; font-weight: 600; color: #475569; background: #fff; border: 1px solid var(--p-border); border-radius: 6px; cursor: pointer; }
        .h-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .clear-btn { padding: 4px 8px; font-size: 11px; font-weight: 600; color: #ef4444; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 6px; cursor: pointer; }
        
        .workspace-grid { display: flex; flex: 1; width: 100%; height: calc(100% - 48px); overflow: hidden; }
        .canvas-column { flex: 1; display: flex; flex-direction: column; position: relative; height: 100%; overflow: hidden; background-color: #f1f5f9; }
        .canvas-frame { flex: 1; width: 100%; height: 100%; position: relative; overflow: hidden; }
        .base-layer { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none; }
        .active-drawing-layer { position: absolute; top: 0; left: 0; z-index: 2; touch-action: none; }
        .sticky-overlay-plane { position: absolute; top: 0; left: 0; z-index: 3; pointer-events: none; width: 100%; height: 100%; }
        
        .floating-toolbar { 
          display: flex; 
          align-items: center; 
          position: absolute; 
          top: 12px; 
          left: 50%; 
          transform: translateX(-50%); 
          background: #ffffff; 
          border: 1px solid var(--p-border); 
          border-radius: 12px; 
          padding: 4px; 
          gap: 6px; 
          z-index: 10; 
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); 
        }
        
        .mobile-double-click-hint { position: absolute; top: 58px; left: 50%; transform: translateX(-50%); background: rgba(15,23,42,0.85); color: white; font-size: 10px; padding: 4px 10px; border-radius: 20px; z-index: 5; pointer-events: none; opacity: 0.7; }
        
        .t-group { display: flex; align-items: center; gap: 2px; background-color: #f8fafc; border: 1px solid var(--p-border); border-radius: 8px; padding: 2px; }
        .t-btn { padding: 4px 10px; font-size: 10px; font-weight: 800; border: none; background: transparent; color: #64748b; border-radius: 6px; cursor: pointer; height: 28px; }
        .t-btn.active { background-color: var(--p-dark); color: #ffffff; }
        .swatch { width: 16px; height: 16px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; margin: 0 1px; }
        .swatch.active { border-color: var(--p-blue); transform: scale(1.1); }
        .thickness-slider { font-size: 10px; font-weight: 700; color: #64748b; padding: 0 6px; gap: 4px; height: 28px; }
        .thickness-slider input { width: 50px; cursor: pointer; accent-color: var(--p-blue); }
        
        .toolbar-clear-btn { padding: 4px 10px; font-size: 10px; font-weight: 800; border: none; background: #fef2f2; color: #ef4444; border-radius: 6px; cursor: pointer; height: 28px; border: 1px solid #fee2e2; }
        .toolbar-clear-btn:hover { background: #fee2e2; }

        .sticky-note-node { width: 120px; height: 120px; border-radius: 8px; box-shadow: 0 6px 12px -3px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden; border: 1px solid rgba(0,0,0,0.04); pointer-events: auto; touch-action: none; }
        .sticky-drag-handle { width: 100%; height: 14px; background-color: rgba(0,0,0,0.04); cursor: move; }
        .sticky-content { padding: 6px; flex: 1; display: flex; flex-direction: column; }
        .sticky-note-node textarea { width: 100%; flex: 1; background: transparent; resize: none; border: none; outline: none; font-size: 10px; font-weight: 700; line-height: 1.3; font-family: inherit; }
        .sticky-delete-btn { align-self: flex-end; font-size: 8px; color: rgba(0,0,0,0.4); background: none; border: none; cursor: pointer; font-weight: 800; }
        .collab-sidebar { width: 260px; background-color: #ffffff; border-left: 1px solid var(--p-border); display: flex; flex-direction: column; height: 100%; flex-shrink: 0; }
        .tab-navigation { display: flex; width: 100%; background: #f8fafc; border-bottom: 1px solid var(--p-border); }
        .tab-link { flex: 1; padding: 10px 2px; text-align: center; font-size: 11px; font-weight: 700; border: none; background: transparent; color: #64748b; cursor: pointer; border-bottom: 2px solid transparent; }
        .tab-link.active { color: var(--p-blue); border-bottom-color: var(--p-blue); background: #ffffff; }
        .sidebar-viewport { flex: 1; overflow: hidden; position: relative; background: #ffffff; }
        .tab-pane-view { display: flex; width: 100%; height: 100%; padding: 10px; box-sizing: border-box; overflow-y: auto; }
        .tab-pane-view.flex-col { flex-direction: column; }
        .tab-pane-view.centering { justify-content: center; align-items: center; }
        .tab-pane-view.spacing { flex-direction: column; gap: 8px; }
        .chat-messages-scroll { flex: 1; background-color: #fafafa; border: 1px solid var(--p-border); border-radius: 8px; padding: 8px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; max-height: calc(100% - 42px); }
        .chat-bubble { background: #ffffff; border: 1px solid var(--p-border); padding: 6px 8px; border-radius: 6px; max-width: 90%; font-size: 11px; }
        .chat-input-row { display: flex; gap: 4px; margin-top: 6px; height: 32px; }
        .chat-input-row input { flex: 1; border: 1px solid var(--p-border); border-radius: 6px; padding: 0 8px; font-size: 11px; outline: none; }
        .chat-input-row button { background: var(--p-blue); color: white; border: none; padding: 0 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
        .raise-hand-trigger { padding: 12px 24px; border-radius: 30px; border: 2px solid var(--p-border); background: #ffffff; font-size: 12px; font-weight: 700; color: #475569; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .raise-hand-trigger.active { background: #fef3c7; border-color: #f59e0b; color: #b45309; }
        .poll-card, .quiz-card { background: #f8fafc; border: 1px solid var(--p-border); border-radius: 8px; padding: 10px; width: 100%; box-sizing: border-box; }
        .poll-card h4 { margin: 0 0 8px 0; font-size: 11px; color: var(--p-dark); }
        .poll-option { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .poll-option button { flex: 1; text-align: left; background: white; border: 1px solid var(--p-border); padding: 6px 10px; font-size: 11px; border-radius: 6px; cursor: pointer; }
        .badge { font-size: 9px; font-weight: 800; color: var(--p-blue); background: #eff6ff; padding: 2px 4px; border-radius: 4px; }
        .q-tag { font-size: 8px; font-weight: 900; color: var(--p-blue); background: #eff6ff; padding: 1px 4px; border-radius: 3px; }
        .q-text { font-size: 11px; font-weight: 700; margin: 4px 0 8px 0; }
        .q-ans-row { display: block; width: 100%; text-align: left; background: white; border: 1px solid var(--p-border); padding: 6px 10px; font-size: 11px; border-radius: 6px; margin-bottom: 4px; cursor: pointer; }
        .q-ans-row.correct { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
        .animate-fade-in { animation: fIn 0.1s ease-out forwards; }
        @keyframes fIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        @media screen and (max-width: 768px) and (orientation: portrait) {
          .force-landscape-rotation {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vh !important;
            height: 100vw !important;
            transform: rotate(90deg) translate(0, -100vw) !important;
            transform-origin: 0 0 !important;
            overflow: hidden !important;
          }
          .collab-sidebar { width: 180px !important; }
          
          .floating-toolbar { 
            top: auto !important;
            bottom: auto !important;
            left: 12px !important;
            right: auto !important;
            transform: translateY(-50%) !important;
            flex-direction: column !important;
          }
          
          .mobile-double-click-hint { 
            top: auto !important;
            bottom: auto !important;
            left: 54px !important;
            transform: translateY(-50%) rotate(-90deg) !important;
          }
          
          .t-btn { padding: 2px 6px; height: 24px; font-size: 9px; }
          .swatch { width: 12px; height: 12px; }
          .thickness-slider { height: 24px; }
          .thickness-slider input { width: 35px; }
          .toolbar-clear-btn { height: 24px; font-size: 9px; padding: 2px 6px; }
        }
      `}</style>
    </div>
  );
}