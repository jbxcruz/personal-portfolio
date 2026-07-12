"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "../Playground.module.scss";

const SIZES = [4, 8, 16, 32];
const PALETTE = ["#111111", "#f7f2e9", "#3BB8E5", "#ffd21e", "#e14b4a", "#4ade80", "#ff6bb3", "#b46bff", "#ff8a3d", "#2b93bd", "#6F787B", "#00000000"];
const CANVAS_PX = 320;

export default function PixelArt() {
  const [size, setSize] = useState(16);
  const [tool, setTool] = useState("pencil"); // pencil | eraser | bucket | line | rect | move
  const [color, setColor] = useState("#3BB8E5");
  const canvasRef = useRef(null);
  const gridRef = useRef([]);
  const dragRef = useRef(null);

  const blank = useCallback((n) => Array.from({ length: n * n }, () => "#00000000"), []);

  useEffect(() => {
    gridRef.current = blank(size);
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const draw = (preview = null) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const cell = CANVAS_PX / size;
    // checkerboard for transparency
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++) {
        ctx.fillStyle = (r + c) % 2 ? "#e8e8e2" : "#ffffff";
        ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    const g = preview || gridRef.current;
    g.forEach((col, i) => {
      if (col === "#00000000") return;
      ctx.fillStyle = col;
      ctx.fillRect((i % size) * cell, Math.floor(i / size) * cell, cell, cell);
    });
    // grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    for (let k = 1; k < size; k++) {
      ctx.beginPath(); ctx.moveTo(k * cell, 0); ctx.lineTo(k * cell, CANVAS_PX); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, k * cell); ctx.lineTo(CANVAS_PX, k * cell); ctx.stroke();
    }
  };

  const cellAt = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * size;
    const y = ((e.clientY - rect.top) / rect.height) * size;
    const c = Math.max(0, Math.min(size - 1, Math.floor(x)));
    const r = Math.max(0, Math.min(size - 1, Math.floor(y)));
    return r * size + c;
  };

  const lineCells = (a, b) => {
    // Bresenham between cell indices
    let r0 = Math.floor(a / size), c0 = a % size, r1 = Math.floor(b / size), c1 = b % size;
    const cells = [];
    const dr = Math.abs(r1 - r0), dc = Math.abs(c1 - c0);
    const sr = r0 < r1 ? 1 : -1, sc = c0 < c1 ? 1 : -1;
    let err = dc - dr;
    while (true) {
      cells.push(r0 * size + c0);
      if (r0 === r1 && c0 === c1) break;
      const e2 = 2 * err;
      if (e2 > -dr) { err -= dr; c0 += sc; }
      if (e2 < dc) { err += dc; r0 += sr; }
    }
    return cells;
  };

  const rectCells = (a, b) => {
    const r0 = Math.min(Math.floor(a / size), Math.floor(b / size));
    const r1 = Math.max(Math.floor(a / size), Math.floor(b / size));
    const c0 = Math.min(a % size, b % size);
    const c1 = Math.max(a % size, b % size);
    const cells = [];
    for (let r = r0; r <= r1; r++)
      for (let c = c0; c <= c1; c++)
        if (r === r0 || r === r1 || c === c0 || c === c1) cells.push(r * size + c);
    return cells;
  };

  const bucket = (start) => {
    const g = gridRef.current;
    const target = g[start];
    if (target === color) return;
    const stack = [start];
    while (stack.length) {
      const i = stack.pop();
      if (g[i] !== target) continue;
      g[i] = color;
      const r = Math.floor(i / size), c = i % size;
      if (r > 0) stack.push(i - size);
      if (r < size - 1) stack.push(i + size);
      if (c > 0) stack.push(i - 1);
      if (c < size - 1) stack.push(i + 1);
    }
  };

  const shiftArt = (dr, dc) => {
    const g = gridRef.current;
    const out = blank(size);
    g.forEach((col, i) => {
      if (col === "#00000000") return;
      const r = Math.floor(i / size) + dr, c = (i % size) + dc;
      if (r >= 0 && r < size && c >= 0 && c < size) out[r * size + c] = col;
    });
    gridRef.current = out;
  };

  const onDown = (e) => {
    e.preventDefault();
    const i = cellAt(e);
    if (tool === "bucket") { bucket(i); draw(); return; }
    dragRef.current = { start: i, last: i };
    if (tool === "pencil") { gridRef.current[i] = color; draw(); }
    if (tool === "eraser") { gridRef.current[i] = "#00000000"; draw(); }
  };

  const onMove = (e) => {
    if (!dragRef.current) return;
    const i = cellAt(e);
    const d = dragRef.current;
    if (tool === "pencil" || tool === "eraser") {
      const col = tool === "pencil" ? color : "#00000000";
      lineCells(d.last, i).forEach((j) => { gridRef.current[j] = col; });
      d.last = i;
      draw();
    } else if (tool === "line" || tool === "rect") {
      const cells = tool === "line" ? lineCells(d.start, i) : rectCells(d.start, i);
      const preview = [...gridRef.current];
      cells.forEach((j) => { preview[j] = color; });
      draw(preview);
    } else if (tool === "move") {
      const dr = Math.floor(i / size) - Math.floor(d.last / size);
      const dc = (i % size) - (d.last % size);
      if (dr || dc) { shiftArt(dr, dc); d.last = i; draw(); }
    }
  };

  const onUp = (e) => {
    if (!dragRef.current) return;
    const i = cellAt(e);
    const d = dragRef.current;
    dragRef.current = null;
    if (tool === "line") { lineCells(d.start, i).forEach((j) => { gridRef.current[j] = color; }); draw(); }
    if (tool === "rect") { rectCells(d.start, i).forEach((j) => { gridRef.current[j] = color; }); draw(); }
  };

  const download = () => {
    const scale = 512 / size;
    const out = document.createElement("canvas");
    out.width = out.height = size * scale;
    const ctx = out.getContext("2d");
    gridRef.current.forEach((col, i) => {
      if (col === "#00000000") return;
      ctx.fillStyle = col;
      ctx.fillRect((i % size) * scale, Math.floor(i / size) * scale, scale, scale);
    });
    const a = document.createElement("a");
    a.download = `jebby-pixel-art-${size}x${size}.png`;
    a.href = out.toDataURL("image/png");
    a.click();
  };

  const TOOLS = [
    ["pencil", "✏"], ["eraser", "◻"], ["bucket", "▨"], ["line", "╱"], ["rect", "▭"], ["move", "✥"],
  ];

  return (
    <div className={styles.paWrap}>
      <div className={styles.paTools}>
        {TOOLS.map(([t, icon]) => (
          <button key={t} className={`${styles.paTool} ${tool === t ? styles.paToolOn : ""}`} onClick={() => setTool(t)} title={t} aria-label={t}>
            {icon}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_PX}
        height={CANVAS_PX}
        className={styles.paCanvas}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      />

      <div className={styles.paSide}>
        <div className={styles.paSizeRow}>
          {SIZES.map((s) => (
            <button key={s} className={`${styles.paSizeBtn} ${size === s ? styles.paSizeOn : ""}`} onClick={() => setSize(s)}>
              {s}×{s}
            </button>
          ))}
        </div>
        <div className={styles.paPalette}>
          {PALETTE.map((c) => (
            <button
              key={c}
              className={`${styles.paSwatch} ${color === c ? styles.paSwatchOn : ""}`}
              style={{ background: c === "#00000000" ? "repeating-conic-gradient(#ccc 0 25%, #fff 0 50%) 0 0/10px 10px" : c }}
              onClick={() => setColor(c)}
              aria-label={c}
            />
          ))}
        </div>
        <button className={styles.paAction} onClick={() => { gridRef.current = blank(size); draw(); }}>Clear</button>
        <button className={styles.paAction} onClick={download}>⤓ Download PNG</button>
      </div>
    </div>
  );
}