'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '../../components/ImageUploader/ImageUploader'
import MaskCanvas from '../../components/MaskCanvas/MaskCanvas'
import ResultViewer from '../../components/ResultViewer/ResultViewer'
import IterationControls from '../../components/IterationControls/IterationControls'
import HistorySidebar from '../../components/HistorySidebar/HistorySidebar'
import { Button } from '../../components/UI'
import { inpaintImage, fetchResultsHistory, clearResultsHistory, fetchHealthStatus } from '../../api/inpaint'
import { theme } from '../../theme'
import { useTheme } from '../../components/context/ThemeContext'

export default function StudioApp() {
  const router = useRouter()
  const { isDarkMode, toggleTheme } = useTheme()
  const [originalImage, setOriginalImage] = useState(null)
  const [maskData, setMaskData] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [backendState, setBackendState] = useState('checking') // 'checking' | 'online' | 'warming'
  const [jobId, setJobId] = useState(null)
  const [history, setHistory] = useState([])
  const [iterations, setIterations] = useState(2)
  const [currentStep, setCurrentStep] = useState(1)
  const [mobileTab, setMobileTab] = useState('studio')

  useEffect(() => {
    // Ping health endpoint on mount to wake up Render backend early if sleeping
    const checkBackend = async () => {
      try {
        const res = await fetchHealthStatus()
        if (res && res.status === 'ok') {
          setBackendState('online')
        } else {
          setBackendState('warming')
        }
      } catch {
        setBackendState('warming')
      }
    }

    const loadHistoryFromApi = async () => {
      const data = await fetchResultsHistory()
      if (Array.isArray(data) && data.length > 0) {
        setBackendState('online')
        const formattedHistory = data.map(item => ({
          id: item.id,
          original: item.original_image_url || item.original_image,
          result: item.result_image_url || item.result_image,
          mask: item.mask_image_url || item.mask_image,
          timestamp: item.created_at || new Date().toISOString(),
          iterations: item.iterations
        }))
        setHistory(formattedHistory)
      }
    }

    checkBackend()
    loadHistoryFromApi()
  }, [])

  const handleImageUpload = (file) => {
    setErrorMessage(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalImage(e.target.result)
      setResultImage(null)
      setMaskData(null)
      setCurrentStep(2)
    }
    reader.readAsDataURL(file)
  }

  const handleMaskChange = (mask) => {
    setMaskData(mask)
  }

  const handleInpaint = async () => {
    if (!originalImage || !maskData) {
      setErrorMessage('Please upload an image and draw a mask first.')
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)
    setStatusMessage('Processing image...')
    setCurrentStep(4)
    try {
      const response = await inpaintImage(
        originalImage,
        maskData,
        iterations,
        (msg) => setStatusMessage(msg)
      )
      setResultImage(response.result_image)
      setJobId(response.job_id)
      setBackendState('online')

      const historyItem = {
        id: response.job_id || Date.now(),
        original: response.original_image || originalImage,
        result: response.result_image,
        mask: response.mask_image || maskData,
        timestamp: response.created_at || new Date().toISOString(),
        iterations: iterations
      }

      setHistory(prev => [historyItem, ...prev])
    } catch (error) {
      console.error('Inpainting failed:', error)
      setErrorMessage(error.message || 'Inpainting failed. Please try again.')
      setCurrentStep(3)
    } finally {
      setIsProcessing(false)
      setStatusMessage(null)
    }
  }

  const handleClearHistory = async () => {
    await clearResultsHistory()
    setHistory([])
    setJobId(null)
    setResultImage(null)
  }

  const handleIterationChange = (newIterations) => {
    setIterations(newIterations)
  }

  const handleHistorySelect = (historyItem) => {
    setOriginalImage(historyItem.original)
    setResultImage(historyItem.result)
    setMaskData(historyItem.mask)
    setIterations(historyItem.iterations || 2)
    setCurrentStep(4)
  }

  const handleNewImage = () => {
    setOriginalImage(null)
    setMaskData(null)
    setResultImage(null)
    setErrorMessage(null)
    setCurrentStep(1)
  }

  const handleEditMask = () => {
    setCurrentStep(2)
  }

  return (
    <div className={`h-screen flex flex-col ${theme.bg.page} overflow-hidden`}>
      {/* Header */}
      <header className={`${theme.bg.card} shadow-md flex-shrink-0 z-20`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => router.push('/')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group transition-transform duration-200 hover:scale-105"
              title="Go to Home Page"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 group-hover:bg-blue-700 rounded-xl flex items-center justify-center shadow-md transition-colors">
                <span className="text-white font-bold text-sm sm:text-base">AI</span>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-lg font-bold ${theme.text.main}`}>InpaintAI Studio</h1>
                <p className={`text-xs ${theme.text.secondary}`}>AI-Powered Object Removal</p>
              </div>
              <div className="block sm:hidden">
                <h1 className={`text-base font-bold ${theme.text.main}`}>InpaintAI</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Backend Health Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-700">
                <span className={`w-2 h-2 rounded-full ${
                  backendState === 'online' ? 'bg-emerald-500 animate-pulse' :
                  backendState === 'warming' ? 'bg-amber-500 animate-ping' : 'bg-blue-500 animate-pulse'
                }`} />
                <span className="text-zinc-600 dark:text-zinc-300">
                  {backendState === 'online' ? 'Backend Ready' : 'Backend Starting...'}
                </span>
              </div>
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={theme.button.icon}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-zinc-700 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleNewImage}
                className={`${theme.button.primary} text-xs sm:text-sm px-3 sm:px-5`}
              >
                + New
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto lg:overflow-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 h-auto lg:h-full">
            
            {/* Mobile View Switcher Tabs (Hidden on Desktop lg:hidden) */}
            <div className="flex lg:hidden bg-zinc-200/80 dark:bg-zinc-800/80 p-1 rounded-xl mb-3 shadow-inner">
              <button
                onClick={() => setMobileTab('studio')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mobileTab === 'studio'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                🎨 Workspace
              </button>
              <button
                onClick={() => setMobileTab('history')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mobileTab === 'history'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                🕒 History ({history.length})
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 h-auto lg:h-full pb-16 lg:pb-0">

              {/* Main Tool Area */}
              <div className={`${theme.card} flex flex-col min-h-[450px] lg:min-h-0 ${mobileTab === 'studio' ? 'flex' : 'hidden lg:flex'}`}>
                {/* Step Indicator */}
                <div className="bg-blue-600 px-3 py-2 flex items-center justify-between flex-shrink-0">
                  <h2 className="text-white font-semibold text-xs sm:text-sm">
                    {currentStep === 1 ? 'Step 1: Upload' :
                      currentStep === 2 ? 'Step 2: Mask' :
                        currentStep === 3 ? 'Step 3: Configure' : 'Step 4: Result'}
                  </h2>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(step => (
                      <div
                        key={step}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${step <= currentStep ? 'bg-white text-blue-600' : 'bg-white/20 text-white/60'
                          }`}
                      >
                        {step < currentStep ? '✓' : step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
                  <div className="h-full flex flex-col items-center justify-center w-full">

                    {/* Error Banner */}
                    {errorMessage && (
                      <div className="w-full max-w-2xl mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start justify-between gap-3 text-red-600 dark:text-red-400 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-base">⚠️</span>
                          <span>{errorMessage}</span>
                        </div>
                        <button
                          onClick={() => setErrorMessage(null)}
                          className="text-red-500 hover:text-red-700 font-bold text-base leading-none"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Progress / Status Banner */}
                    {statusMessage && (
                      <div className="w-full max-w-2xl mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-3 text-blue-600 dark:text-blue-400 text-xs sm:text-sm animate-pulse">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        <span>{statusMessage}</span>
                      </div>
                    )}

                    {/* Step 1: Upload */}
                    {currentStep === 1 && (
                      <div className="w-full max-w-2xl">
                        <ImageUploader onImageUpload={handleImageUpload} isLoading={isProcessing} />
                      </div>
                    )}

                    {/* Step 2: Mask */}
                    {currentStep === 2 && originalImage && (
                      <div className="w-full flex flex-col items-center gap-4">
                        <MaskCanvas
                          originalImage={originalImage}
                          onMaskChange={handleMaskChange}
                          disabled={isProcessing}
                          isLoading={isProcessing}
                        />
                        <div className="flex justify-center gap-3 w-full max-w-lg mt-2">
                          <Button variant="secondary" onClick={handleNewImage} size="sm">Cancel</Button>
                          <Button
                            variant="primary"
                            onClick={() => setCurrentStep(3)}
                            disabled={!maskData}
                            size="sm"
                            className="flex-1"
                          >
                            Next Step →
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Configuration */}
                    {currentStep === 3 && originalImage && maskData && (
                      <div className="animate-fade-in-up flex flex-col gap-6 sm:gap-8 w-full max-w-3xl">
                        <div className="text-center">
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            Configure Processing
                          </h2>
                          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md mx-auto">
                            Adjust settings for optimal results
                          </p>
                        </div>

                        <div className="max-w-3xl mx-auto w-full space-y-4 sm:space-y-6">
                          <IterationControls
                            iterations={iterations}
                            onIterationChange={handleIterationChange}
                            isLoading={isProcessing}
                          />

                          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-6">
                            <h4 className="text-slate-700 dark:text-slate-200 font-semibold mb-4 text-sm sm:text-base">Preview</h4>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                              {/* Original */}
                              <div className="flex flex-col items-center gap-2">
                                <img
                                  src={originalImage}
                                  alt="Original"
                                  className="w-full max-w-[240px] sm:w-64 h-44 sm:h-52 object-contain rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-900"
                                />
                                <span className="text-xs text-slate-500 font-medium">Original Image</span>
                              </div>

                              <div className="text-xl sm:text-2xl text-blue-600 font-bold animate-pulse sm:rotate-0 rotate-90">
                                →
                              </div>
                              {/* Original + Mask overlay */}
                              <div className="flex flex-col items-center gap-2">
                                <div className="relative w-full max-w-[240px] sm:w-64 h-44 sm:h-52 rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-md bg-white dark:bg-slate-900">
                                  {/* Base image */}
                                  <img
                                    src={originalImage}
                                    alt="With mask"
                                    className="absolute inset-0 w-full h-full object-contain"
                                  />
                                  {/* Mask overlay */}
                                  <img
                                    src={maskData}
                                    alt="Mask overlay"
                                    className="absolute inset-0 w-full h-full object-contain opacity-70 mix-blend-multiply"
                                  />
                                </div>
                                <span className="text-xs text-slate-500 font-medium">Masked Image</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button variant="secondary" onClick={() => setCurrentStep(2)} size="sm">← Back</Button>
                          <Button variant="primary" onClick={handleInpaint} disabled={isProcessing} size="sm">
                            {isProcessing ? '⏳ Processing...' : ' Start Inpainting →'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Result */}
                    {currentStep === 4 && (
                      <div className="w-full h-full flex flex-col">
                        <ResultViewer
                          resultImage={resultImage}
                          isLoading={isProcessing}
                          originalImage={originalImage}
                          processingTime={isProcessing ? null : 5.2}
                        />
                        {!isProcessing && resultImage && (
                          <div className="flex justify-center gap-2 mt-4">
                            <Button variant="secondary" onClick={handleEditMask} size="sm">✏️ Edit Mask</Button>
                            <Button variant="primary" onClick={handleNewImage} size="sm">🎨 Start New</Button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </div>

              {/* History Sidebar */}
              <div className={`${theme.card} flex flex-col lg:h-full lg:overflow-hidden h-[450px] ${mobileTab === 'history' ? 'flex' : 'hidden lg:flex'}`}>
                <div className="bg-blue-600 px-3 py-2 flex-shrink-0 flex justify-between items-center">
                  <h3 className="text-white font-semibold text-xs sm:text-sm">🕒 History</h3>
                  <span className="text-[10px] text-white/80 bg-white/20 px-2 py-0.5 rounded-full">{history.length} items</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                  <HistorySidebar
                    history={history}
                    onSelect={(item) => {
                      handleHistorySelect(item)
                      setMobileTab('studio')
                    }}
                    selectedId={jobId}
                    onClearHistory={handleClearHistory}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
