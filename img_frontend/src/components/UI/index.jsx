'use client'

import React from 'react'

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    className = '',
    type = 'button',
    icon = null
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'

    const variants = {
        primary: 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        secondary: 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-500 shadow-sm hover:bg-blue-50 dark:hover:bg-slate-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
        success: 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed',
        danger: 'bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed',
        ghost: 'bg-transparent text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700'
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-xs sm:text-sm',
        md: 'px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base',
        lg: 'px-6 py-3 sm:px-8 sm:py-3.5 text-base sm:text-lg'
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    )
}

/**
 * Card Component
 */
export const Card = ({ children, className = '', elevated = false }) => {
    const baseStyles = 'bg-white dark:bg-slate-800 rounded-xl border-2 transition-all duration-300'
    const elevationStyles = elevated
        ? 'shadow-xl border-blue-600 dark:border-blue-500 hover:shadow-2xl'
        : 'shadow-md border-slate-200 dark:border-slate-700 hover:shadow-lg'

    return (
        <div className={`${baseStyles} ${elevationStyles} ${className}`}>
            {children}
        </div>
    )
}

/**
 * Badge Component
 */
export const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
        primary: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
        success: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
        warning: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
        danger: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}

/**
 * Spinner Component
 */
export const Spinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    }

    return (
        <div className={`${sizes[size]} border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin ${className}`} />
    )
}

/**
 * Alert Component
 */
export const Alert = ({ children, variant = 'info', className = '' }) => {
    const variants = {
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300',
        success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300',
        warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-600 dark:border-amber-500 text-amber-700 dark:text-amber-300',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-600 dark:border-red-500 text-red-700 dark:text-red-300'
    }

    return (
        <div className={`p-4 rounded-lg border-2 ${variants[variant]} ${className}`}>
            {children}
        </div>
    )
}

/**
 * Container Component
 */
export const Container = ({ children, className = '', size = 'default' }) => {
    const sizes = {
        sm: 'max-w-4xl',
        default: 'max-w-7xl',
        lg: 'max-w-screen-2xl',
        full: 'max-w-full'
    }

    return (
        <div className={`${sizes[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    )
}

/**
 * Section Component
 */
export const Section = ({ title, description, children, className = '' }) => {
    return (
        <div className={`space-y-6 ${className}`}>
            {(title || description) && (
                <div className="text-center">
                    {title && (
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                            {description}
                        </p>
                    )}
                </div>
            )}
            {children}
        </div>
    )
}

/**
 * StepIndicator Component
 */
export const StepIndicator = ({ number, label, status = 'pending' }) => {
    const statusStyles = {
        pending: 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
        active: 'bg-blue-600 text-white shadow-lg scale-110',
        completed: 'bg-emerald-600 text-white shadow-md'
    }

    const labelStyles = {
        pending: 'text-slate-500 dark:text-slate-400',
        active: 'text-blue-600 dark:text-blue-400 font-semibold',
        completed: 'text-emerald-600 dark:text-emerald-400'
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${statusStyles[status]}`}>
                {status === 'completed' ? '✓' : number}
            </div>
            <span className={`text-[9px] sm:text-[10px] md:text-xs font-medium transition-colors ${labelStyles[status]}`}>
                {label}
            </span>
        </div>
    )
}

/**
 * Divider Component
 */
export const Divider = ({ orientation = 'horizontal', className = '' }) => {
    const orientationStyles = orientation === 'horizontal'
        ? 'h-px w-full'
        : 'w-px h-full'

    return <div className={`bg-slate-300 dark:bg-slate-700 ${orientationStyles} ${className}`} />
}

/**
 * Input Component
 */
export const Input = ({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    className = '',
    disabled = false
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
        />
    )
}

/**
 * Tooltip Component
 */
export const Tooltip = ({ children, text, className = '' }) => {
    return (
        <div className={`group relative inline-block ${className}`}>
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
            </div>
        </div>
    )
}

export default {
    Button,
    Card,
    Badge,
    Spinner,
    Alert,
    Container,
    Section,
    StepIndicator,
    Divider,
    Input,
    Tooltip
}
