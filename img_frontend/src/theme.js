/**
 * MATERIAL INSPIRED THEME CONFIGURATION
 * Single source of truth for all application colors and styles.
 * Change values here to update the entire application look.
 */

export const theme = {
    // -------------------------------------------------------------------------
    // COLOR PALETTE TOKENS (Semantic Names)
    // -------------------------------------------------------------------------

    // Background Colors
    bg: {
        page: 'bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300',
        card: 'bg-white dark:bg-zinc-800 transition-colors duration-300',
        section: 'bg-zinc-100 dark:bg-zinc-900/50 transition-colors duration-300',
        toolbar: 'bg-zinc-50 dark:bg-zinc-700 border-b border-zinc-200 dark:border-zinc-600',
        overlay: 'bg-white/80 dark:bg-black/80 backdrop-blur-sm',
        input: 'bg-zinc-200 dark:bg-zinc-600',
        active: 'bg-blue-50 dark:bg-blue-900/20',
    },

    // Text Colors
    text: {
        main: 'text-zinc-900 dark:text-zinc-100',
        secondary: 'text-zinc-600 dark:text-zinc-400',
        muted: 'text-zinc-500 dark:text-zinc-500',
        inverse: 'text-white',
        accent: 'text-blue-600 dark:text-blue-400',
        danger: 'text-red-600 dark:text-red-400',
    },

    // Border Colors
    border: {
        default: 'border-zinc-200 dark:border-zinc-700',
        highlight: 'border-blue-500',
    },

    // -------------------------------------------------------------------------
    // COMPONENT STYLES
    // -------------------------------------------------------------------------

    // Buttons
    button: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        secondary: 'bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-600 px-4 py-2 rounded-xl font-medium shadow-sm hover:shadow-md active:scale-95 transition-all duration-200',
        //NEW: Larger CTA buttons
        primaryLg: 'bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-2xl text-base font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        secondaryLg: 'bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-600 px-6 py-3 rounded-2xl text-base font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all duration-200',

        danger: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 px-4 py-2 rounded-xl font-medium transition-colors',
        icon: 'p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-600 text-zinc-600 dark:text-zinc-300 transition-colors',
        toolActive: 'bg-blue-600 text-white shadow-md',
        toolInactive: 'bg-white dark:bg-zinc-600 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-500',
    },

    // Cards & Containers
    card: 'bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden transition-colors duration-300',

    // Inputs
    input: {
        range: 'w-full h-2 bg-zinc-200 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-blue-600',
    },

    // Status Indicators
    status: {
        loading: 'border-zinc-300 border-t-blue-600',
    }
}

// -------------------------------------------------------------------------
// APP CONFIGURATION
// -------------------------------------------------------------------------
export const config = {
    apiUrl: 'http://localhost:8000',
    maxFileSize: 10 * 1024 * 1024,
    maxIterations: 10,
    defaultIterations: 2,
    canvas: {
        maxWidth: 1920,
        maxHeight: 1080,
        defaultBrushSize: 30,
        minBrushSize: 5,
        maxBrushSize: 100,
        maskColor: 'rgba(59, 130, 246, 0.5)',
    },
}

export const messages = {
    error: {
        network: 'Cannot connect to server',
        fileSize: 'File too large (max 10MB)',
        fileType: 'Please select an image file',
        processing: 'Processing failed',
    },
    success: {
        uploaded: 'Image uploaded!',
        processed: 'Processing complete!',
    },
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export default { theme, config, messages, cn }
