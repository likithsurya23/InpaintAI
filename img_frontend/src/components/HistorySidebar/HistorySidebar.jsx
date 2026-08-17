'use client'

import React from 'react'
import { theme } from '../../theme'

const HistorySidebar = ({ history, onSelect, selectedId, onClearHistory }) => {
  if (history.length === 0) {
    return (
      <div className={`h-full flex flex-col ${theme.bg.card} transition-colors duration-300`}>
        <div className="p-4 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mb-4 transition-colors">
            <span className="text-3xl sm:text-4xl">🖼️</span>
          </div>
          <h4 className={`text-sm sm:text-base font-semibold ${theme.text.main} mb-2`}>
            No History Yet
          </h4>
          <p className={`text-xs sm:text-sm ${theme.text.secondary}`}>
            Your processed images will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-full flex flex-col ${theme.bg.card} transition-colors duration-300`}>
      {/* History Items */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 custom-scrollbar">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`group cursor-pointer rounded-xl transition-all duration-200 overflow-hidden border ${selectedId === item.id
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 shadow-md ring-1 ring-blue-500'
              : 'bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:shadow-md'
              }`}
          >
            {/* Image Preview */}
            <div className={`relative aspect-video ${theme.bg.section} overflow-hidden`}>
              <img
                src={item.result}
                alt="Result"
                className="w-full h-full object-contain"
                loading="lazy"
              />
              {/* Selected Indicator */}
              {selectedId === item.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-200" />
            </div>

            {/* Info Section */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs sm:text-sm font-medium ${theme.text.main}`}>
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-900/30 ${theme.text.accent}`}>
                  {item.iterations || 2}x
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] sm:text-xs ${theme.text.muted}`}>
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
                {/* Download Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const link = document.createElement('a')
                    link.href = item.result
                    link.download = `inpainted-${item.id}.png`
                    link.click()
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-xs shadow-sm active:scale-95"
                  title="Download"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clear Button */}
      {history.length > 0 && (
        <div className={`p-3 ${theme.bg.card} border-t ${theme.border.default} mt-auto`}>
          <button
            onClick={onClearHistory}
            className={theme.button.danger + " w-full flex items-center justify-center gap-2 text-sm"}
          >
            <span>🗑️</span> Clear All ({history.length})
          </button>
        </div>
      )}
    </div>
  )
}

export default HistorySidebar
