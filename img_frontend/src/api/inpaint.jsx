import axios from "axios"

export const getApiUrl = () => {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return "http://127.0.0.1:8000"
}

/**
 * Execute inpainting request against DRF REST API endpoint
 */
export async function inpaintImage(originalImageDataUrl, maskDataUrl, iterations) {
  try {
    const API_URL = getApiUrl()

    // Convert data URLs to Blobs for multipart form submission
    const imageBlob = await (await fetch(originalImageDataUrl)).blob()
    const maskBlob = await (await fetch(maskDataUrl)).blob()

    const formData = new FormData()
    formData.append("image", imageBlob, "image.png")
    formData.append("mask", maskBlob, "mask.png")
    formData.append("iterations", iterations)

    // Call DRF REST API endpoint
    const response = await axios.post(
      `${API_URL}/api/inpaint/`,
      formData,
      {
        headers: {
          "Accept": "application/json, image/png",
        }
      }
    )

    // Handle standard DRF JSON response
    const data = response.data
    if (data && typeof data === "object" && (data.result_image_url || data.result_image)) {
      const formatUrl = (url) => {
        if (!url) return null
        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url
        return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`
      }

      const resultUrl = formatUrl(data.result_image_url || data.result_image)
      const origUrl = formatUrl(data.original_image_url || data.original_image)
      const maskUrl = formatUrl(data.mask_image_url || data.mask_image)

      return {
        id: data.id,
        result_image: resultUrl,
        original_image: origUrl,
        mask_image: maskUrl,
        job_id: data.id ? String(data.id) : Date.now().toString(),
        created_at: data.created_at || new Date().toISOString(),
        iterations: data.iterations || iterations
      }
    }

    // Handle Blob response if returned directly
    if (response.data instanceof Blob) {
      const resultUrl = URL.createObjectURL(response.data)
      return {
        result_image: resultUrl,
        job_id: Date.now().toString(),
      }
    }

    throw new Error("Unexpected response format from backend API")
  } catch (error) {
    console.error("Inpaint API error:", error)

    if (error.message === "Network Error") {
      throw new Error("Cannot reach backend (network/CORS). Is Django running on http://127.0.0.1:8000?")
    }

    if (error.response && error.response.data) {
      const serverMsg = typeof error.response.data === "object"
        ? JSON.stringify(error.response.data)
        : error.response.data
      throw new Error(`Backend error (${error.response.status}): ${serverMsg}`)
    }

    throw error
  }
}

/**
 * REST API call to fetch inpainting history list
 */
export async function fetchResultsHistory() {
  try {
    const API_URL = getApiUrl()
    const response = await axios.get(`${API_URL}/api/results/`)
    return response.data
  } catch (error) {
    console.error("Failed to fetch results history:", error)
    return []
  }
}

/**
 * REST API call to delete a single result from history
 */
export async function deleteResultHistory(id) {
  try {
    const API_URL = getApiUrl()
    await axios.delete(`${API_URL}/api/results/${id}/`)
    return true
  } catch (error) {
    console.error(`Failed to delete result ${id}:`, error)
    return false
  }
}

/**
 * REST API call to clear all inpainting history
 */
export async function clearResultsHistory() {
  try {
    const API_URL = getApiUrl()
    await axios.delete(`${API_URL}/api/results/clear/`)
    return true
  } catch (error) {
    console.error("Failed to clear results history:", error)
    return false
  }
}

/**
 * REST API call to check backend service health
 */
export async function fetchHealthStatus() {
  try {
    const API_URL = getApiUrl()
    const response = await axios.get(`${API_URL}/api/health/`)
    return response.data
  } catch (error) {
    console.error("Backend health check failed:", error)
    return { status: "error", error: error.message }
  }
}
