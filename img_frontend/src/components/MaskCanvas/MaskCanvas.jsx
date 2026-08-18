'use client'

import React, { useRef, useEffect, useState } from 'react'
import { theme, config } from '../../theme'

const MaskCanvas = ({
  originalImage,
  onMaskChange,
  disabled = false,
  isLoading = false
}) => {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(config.canvas.defaultBrushSize)
  const [tool, setTool] = useState('brush')
  const [hasDrawn, setHasDrawn] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)

  // Initialize Canvas Size based on Image
  useEffect(() => {
    if (!originalImage) return

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const maxWidth = config.canvas.maxWidth
      const maxHeight = config.canvas.maxHeight
      let { width, height } = img

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.floor(width * ratio)
        height = Math.floor(height * ratio)
      }

      setCanvasSize({ width, height })
      setImageLoaded(true)

      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, width, height)
      }
      setHasDrawn(false)
      onMaskChange(null)
    }
    img.src = originalImage
  }, [originalImage])

  const getMousePos = (event) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    }
  }

  const getTouchPos = (event) => {
    const canvas = canvasRef.current
    if (!canvas || !event.touches || event.touches.length === 0) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const touch = event.touches[0]

    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (event) => {
    if (disabled || isLoading) return
    setIsDrawing(true)
    const pos = getMousePos(event)
    drawAtPosition(pos.x, pos.y)
  }

  const draw = (event) => {
    if (!isDrawing || disabled || isLoading) return
    const pos = getMousePos(event)
    drawAtPosition(pos.x, pos.y)
  }

  const handleTouchStart = (event) => {
    if (disabled || isLoading) return
    setIsDrawing(true)
    const pos = getTouchPos(event)
    drawAtPosition(pos.x, pos.y)
  }

  const handleTouchMove = (event) => {
    if (!isDrawing || disabled || isLoading) return
    const pos = getTouchPos(event)
    drawAtPosition(pos.x, pos.y)
  }

  const handleTouchEnd = () => {
    stopDrawing()
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      updateMaskData()
    }
  }

  const drawAtPosition = (x, y) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    if (tool === 'brush') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'
    } else {
      ctx.globalCompositeOperation = 'destination-out'
    }

    ctx.beginPath()
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
    ctx.fill()

    if (!hasDrawn) setHasDrawn(true)
  }

  const updateMaskData = () => {
    const canvas = canvasRef.current
    if (!canvas || canvas.width === 0 || canvas.height === 0) return

    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = canvas.width
    maskCanvas.height = canvas.height
    const maskCtx = maskCanvas.getContext('2d')

    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const maskData = maskCtx.createImageData(canvas.width, canvas.height)

    let hasMaskPixels = false

    for (let i = 0; i < imageData.data.length; i += 4) {
      const alpha = imageData.data[i + 3]
      if (alpha > 10) {
        maskData.data[i] = 255
        maskData.data[i + 1] = 255
        maskData.data[i + 2] = 255
        maskData.data[i + 3] = 255
        hasMaskPixels = true
      } else {
        maskData.data[i] = 0
        maskData.data[i + 1] = 0
        maskData.data[i + 2] = 0
        maskData.data[i + 3] = 255
      }
    }

    maskCtx.putImageData(maskData, 0, 0)

    if (hasMaskPixels) {
      const maskDataUrl = maskCanvas.toDataURL('image/png')
      onMaskChange(maskDataUrl)
    } else {
      onMaskChange(null)
    }
  }

  const clearMask = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    onMaskChange(null)
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (disabled || isLoading) return
      switch (event.key.toLowerCase()) {
        case 'b': setTool('brush'); break
        case 'e': setTool('eraser'); break
        case '[': setBrushSize(prev => Math.max(5, prev - 5)); break
        case ']': setBrushSize(prev => Math.min(100, prev + 5)); break
        default: break
      }
    }
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [disabled, isLoading])

  if (!originalImage) return null;

  return (
    <div className={`w-full max-w-4xl flex flex-col items-center ${theme.card}`}>

      {/* Configuration Header */}
      <div className={`w-full px-3 py-2 sm:px-4 sm:py-3 flex flex-wrap justify-between items-center gap-2 sm:gap-3 ${theme.bg.toolbar}`}>

        {/* Tool Selector */}
        <div className="flex gap-1.5 sm:gap-2">
          <button
            onClick={() => setTool('brush')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${tool === 'brush' ? theme.button.toolActive : theme.button.toolInactive
              }`}
          >
            🖌️ Brush
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${tool === 'eraser' ? theme.button.toolActive : theme.button.toolInactive
              }`}
          >
            🧽 Eraser
          </button>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2 sm:gap-3">
          <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
            Size: <span className="text-blue-600 font-extrabold">{brushSize}px</span>
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            disabled={disabled || isLoading}
            className="w-24 sm:w-32 h-2 sm:h-2.5 bg-slate-300 dark:bg-slate-700 rounded-lg cursor-pointer appearance-auto accent-blue-600"
          />
        </div>


        {/* Clear Button */}
        <button
          onClick={clearMask}
          disabled={disabled || isLoading || !hasDrawn}
          className='bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1'
          title="Clear entire mask"
        >
          <span>🗑️</span>
          Clear Mask
        </button>
      </div>

      {/* Canvas Layering */}
      <div className={`p-2 sm:p-4 w-full flex justify-center items-center overflow-auto min-h-[300px] sm:min-h-[400px] ${theme.bg.section}`}>
        <div
          className={`relative shadow-lg border bg-checkered inline-flex justify-center items-center ${theme.border.default}`}
        >
          {/* Checkered pattern background for transparency */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNlNWU1ZTUiLz4KPHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2U1ZTVlNSIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none"></div>

          {/* Layer 1: Background Image */}
          <img
            ref={imageRef}
            src={originalImage}
            alt="Original"
            className="relative z-0 pointer-events-none select-none block max-w-full max-h-[60vh] sm:max-h-[75vh] w-auto h-auto object-contain"
            draggable={false}
          />

          {/* Layer 2: Mask Canvas (Transparent) */}
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`absolute inset-0 w-full h-full z-10 cursor-crosshair touch-none ${isLoading || disabled ? 'pointer-events-none' : ''
              }`}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className={`absolute inset-0 z-20 flex items-center justify-center ${theme.bg.overlay}`}>
              <div className={`w-10 h-10 border-4 rounded-full animate-spin ${theme.status.loading}`}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MaskCanvas
