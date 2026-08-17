'use client'

import React, { useRef, useState } from 'react'

const ImageUploader = ({ onImageUpload, isLoading = false }) => {
  const fileInputRef = useRef(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    processFile(file)
  }

  const processFile = (file) => {
    if (!file) return

    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, WebP, etc.)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Please select an image smaller than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
    }
    reader.readAsDataURL(file)

    onImageUpload(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragActive(false)

    const file = event.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragActive(false)
  }

  const handleUploadClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click()
    }
  }

  const handleRemoveImage = (event) => {
    event.stopPropagation()
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleReplaceImage = (event) => {
    event.stopPropagation()
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={`
          relative rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
            ${previewUrl
            ? 'p-0 shadow-lg bg-zinc-50 dark:bg-zinc-800'
            : `p-8 sm:p-12 shadow-md hover:shadow-lg transition-all
              ${isDragActive
              ? 'bg-blue-50 dark:bg-blue-900/20 scale-105'
              : 'bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700'
            }`
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!previewUrl ? handleUploadClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />

        {!previewUrl ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div>
              <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {isDragActive ? 'Drop your image here' : 'Upload Image'}
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                JPG, PNG, WebP • Max 10MB
              </p>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain bg-white dark:bg-zinc-900"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
              <button
                onClick={handleReplaceImage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                disabled={isLoading}
              >
                Replace
              </button>
              <button
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                disabled={isLoading}
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUploader
