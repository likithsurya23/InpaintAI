'use client'

import React, { useState } from 'react'
import { theme } from '../../theme'

const ResultViewer = ({ resultImage, isLoading, processingTime, originalImage }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleDownload = () => {
    if (!resultImage) return
    const link = document.createElement('a')
    link.href = resultImage
    link.download = `inpainted-result-${new Date().getTime()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyToClipboard = async () => {
    try {
      const response = await fetch(resultImage)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ])
      alert('Image copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy image: ', err)
      alert('Failed to copy image to clipboard')
    }
  }

  const formatProcessingTime = (seconds) => {
    if (!seconds) return null
    return `${seconds.toFixed(1)} seconds`
  }

  if (isLoading) {
    return (
      <div
        className={`
          w-full h-full min-h-[400px]
          flex flex-col items-center justify-center
          p-10
          ${theme.bg.card}
          ${theme.border.default}
          border rounded-2xl shadow-sm
          transition-colors duration-300
        `}
      >
        {/* Spinner */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative w-20 h-20">
            <div
              className={`
                absolute inset-0
                border-4
                border-zinc-300 dark:border-zinc-700
                border-t-blue-600
                rounded-full
                animate-spin
              `}
            />
            <div
              className={`
                absolute inset-2
                border-4
                border-transparent
                border-t-purple-500
                rounded-full
                animate-spin
              `}
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            />
          </div>

          {/* Text */}
          <div>
            <h3 className={`text-xl font-bold ${theme.text.main} mb-2`}>
              AI is Working Its Magic
            </h3>
            <p className={`${theme.text.muted} text-sm mb-4`}>
              Removing objects and reconstructing your image…
            </p>

            {/* Steps */}
            <div className="space-y-2">
              {[
                "Processing image",
                "Analyzing content",
                "Generating result",
              ].map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 text-sm ${
                    index === 0
                      ? theme.text.main
                      : theme.text.muted
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      index === 0
                        ? "bg-blue-600 animate-pulse"
                        : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                  />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className={`text-xs ${theme.text.muted}`}>
          This usually takes 10–30 seconds depending on image size
        </p>
      </div>
    );
  }

  if (!resultImage) {
    return (
      <div className={`w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 ${theme.bg.card} ${theme.border.default} border rounded-xl shadow-sm border-dashed`}>
        <div className={`${theme.text.secondary} mb-4`}>
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className={`text-lg font-bold ${theme.text.main} mb-2`}>No Result Yet</h3>
        <p className={`${theme.text.muted} text-sm max-w-xs text-center`}>
          Complete the steps above to see your AI-generated image here.
        </p>
      </div>
    )
  }

  return (
    <div className={`w-full h-full flex flex-col ${theme.card} border ${theme.border.default} overflow-hidden`}>

      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 ${theme.bg.toolbar} shrink-0`}>
        <h3 className={`text-base font-bold ${theme.text.main}`}>Inpainted Result</h3>
        <div className="flex items-center gap-2">
          {processingTime && (
            <span className={`text-xs ${theme.text.muted} bg-zinc-100 dark:bg-zinc-600 px-2 py-1 rounded-md`}>
              {formatProcessingTime(processingTime)}
            </span>
          )}
          {originalImage && (
            <button
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? 'Hide Original' : 'Compare'}
            </button>
          )}
        </div>
      </div>

      {/* Image Container */}
      <div className={`relative flex-1 ${theme.bg.section} flex items-center justify-center p-4 overflow-hidden`}>
        {showComparison && originalImage ? (
          <div className="grid grid-cols-2 gap-4 w-full h-full">
            <div className={`relative ${theme.bg.input} rounded-lg overflow-hidden flex items-center justify-center`}>
              <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain" />
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/50 text-white px-2 py-0.5 rounded shadow-sm">BEFORE</span>
            </div>
            <div className={`relative ${theme.bg.input} rounded-lg overflow-hidden flex items-center justify-center`}>
              <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain" />
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm">AFTER</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-zinc-300 border-t-blue-600 rounded-full animate-spin" />
              </div>
            )}
            <img
              src={resultImage}
              alt="Result"
              onLoad={handleImageLoad}
              className={`max-w-full max-h-full object-contain rounded-lg shadow-sm transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={`flex justify-between items-center p-3 ${theme.bg.toolbar} shrink-0`}>
        <button
          onClick={handleDownload}
          className={`${theme.button.secondary}`}
        >
          <span>⬇️</span> Download
        </button>
        <button
          onClick={handleCopyToClipboard}
          className={`${theme.button.secondary}`}
        >
          <span>📋</span> Copy
        </button>
      </div>
    </div>
  )
}

export default ResultViewer
