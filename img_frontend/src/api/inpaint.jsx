import axios from "axios"

export const getApiUrl = () => {
  let url = ""
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL !== undefined) {
    url = process.env.NEXT_PUBLIC_API_URL
  } else {
    url = "http://127.0.0.1:8000"
  }
  // Trim trailing slashes to avoid double-slash path concatenation (e.g., //api/inpaint/)
  return url ? url.replace(/\/+$/, "") : ""
}

export const buildEndpointUrl = (path) => {
  const baseUrl = getApiUrl()
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath
}

/**
 * Execute inpainting request against DRF REST API endpoint
 */
export async function inpaintImage(originalImageDataUrl, maskDataUrl, iterations) {
  try {
    // Convert data URLs to Blobs for multipart form submission
    const imageBlob = await (await fetch(originalImageDataUrl)).blob()
    const maskBlob = await (await fetch(maskDataUrl)).blob()

    const formData = new FormData()
    formData.append("image", imageBlob, "image.png")
    formData.append("mask", maskBlob, "mask.png")
    formData.append("iterations", iterations)

    // Call DRF REST API endpoint
    const endpoint = buildEndpointUrl("/api/inpaint/")
    const response = await axios.post(
      endpoint,
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
        return buildEndpointUrl(url)
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

    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      const targetUrl = getApiUrl() || "http://127.0.0.1:8000"
      throw new Error(`Cannot connect to backend server at ${targetUrl}. Please start Django using 'python manage.py runserver' or run 'docker-compose up'.`)
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
    const response = await axios.get(buildEndpointUrl("/api/results/"))
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
    await axios.delete(buildEndpointUrl(`/api/results/${id}/`))
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
    await axios.delete(buildEndpointUrl("/api/results/clear/"))
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
    const response = await axios.get(buildEndpointUrl("/api/health/"))
    return response.data
  } catch (error) {
    console.error("Backend health check failed:", error)
    return { status: "error", error: error.message }
  }
}

