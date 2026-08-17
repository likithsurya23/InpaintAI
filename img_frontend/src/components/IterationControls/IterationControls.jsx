'use client'

import React from 'react'
import { theme } from '../../theme'

const IterationControls = ({ iterations, onIterationChange, isLoading = false }) => {
  const handleIterationChange = (value) => {
    const newValue = Math.max(1, Math.min(5, value))
    onIterationChange(newValue)
  }

  const increment = () => {
    if (!isLoading) {
      handleIterationChange(iterations + 1)
    }
  }

  const decrement = () => {
    if (!isLoading) {
      handleIterationChange(iterations - 1)
    }
  }

  const getIterationLabel = (count) => {
    const labels = {
      1: "Quick",
      2: "Balanced",
      3: "Detailed",
      4: "Enhanced",
      5: "Ultra"
    }
    return labels[count] || "Custom"
  }

  const getIterationDescription = (count) => {
    const descriptions = {
      1: "Fastest processing, basic refinement",
      2: "Good balance of speed and quality",
      3: "Recommended for most cases",
      4: "Higher quality, slower processing",
      5: "Maximum quality, slowest processing"
    }
    return descriptions[count]
  }

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-lg transition-all ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div>
          <h3 className={`text-base sm:text-lg font-bold ${theme.text.main} mb-1`}>Refinement Level</h3>
          <p className={`text-xs sm:text-sm ${theme.text.secondary}`}>Adjust AI processing intensity</p>
        </div>
        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md ${theme.button.toolActive}`}>
          {iterations} {iterations === 1 ? 'Iteration' : 'Iterations'}
        </span>
      </div>

      {/* Slider Container */}
      <div className="flex items-center gap-4 mb-6">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-500 transition-all hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          onClick={decrement}
          disabled={iterations <= 1 || isLoading}
          aria-label="Decrease iterations"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="1"
            max="5"
            value={iterations}
            onChange={(e) => handleIterationChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            disabled={isLoading}
            aria-label="Refinement iterations"
          />

          <div className="flex justify-between mt-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <div
                key={value}
                className={`flex flex-col items-center cursor-pointer transition-all hover:-translate-y-0.5 ${value <= iterations ? 'text-primary-500' : 'text-slate-400'}`}
                onClick={() => handleIterationChange(value)}
              >
                <span className={`w-2 h-2 rounded-full transition-all ${value <= iterations ? 'bg-primary-500 scale-125' : 'bg-slate-300'}`} />
                <span className="text-xs font-semibold mt-1">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className={`${theme.button.toolInactive} w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed`}
          onClick={increment}
          disabled={iterations >= 5 || isLoading}
          aria-label="Increase iterations"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Info Section */}
      <div className={`${theme.bg.section} rounded-xl p-4 sm:p-5 transition-colors`}>
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className={`text-sm sm:text-base font-bold ${theme.text.main}`}>{getIterationLabel(iterations)}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-1.5 rounded-sm transition-all ${level <= iterations ? 'bg-blue-600 dark:bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}
                style={{ height: `${6 + level * 2}px` }}
              />
            ))}
          </div>
        </div>

        <p className={`text-xs sm:text-sm ${theme.text.secondary} text-center mb-4 sm:mb-5`}>
          {getIterationDescription(iterations)}
        </p>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${theme.text.secondary} w-12 sm:w-14`}>Quality:</span>
            <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(iterations / 5) * 100}%` }}
              />
            </div>
            <span className={`text-xs font-semibold ${theme.text.main} w-8 sm:w-10 text-right`}>{Math.round((iterations / 5) * 100)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${theme.text.secondary} w-12 sm:w-14`}>Speed:</span>
            <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${((6 - iterations) / 5) * 100}%` }}
              />
            </div>
            <span className={`text-xs font-semibold ${theme.text.main} w-8 sm:w-10 text-right`}>{Math.round(((6 - iterations) / 5) * 100)}%</span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 mt-4 sm:mt-5 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-colors">
          <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400">
            Processing with {iterations} iteration{iterations > 1 ? 's' : ''}...
          </span>
        </div>
      )}
    </div>
  )
}

export default IterationControls
