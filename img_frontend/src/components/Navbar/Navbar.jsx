'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { theme } from '../../theme'

const Navbar = () => {
    const router = useRouter()
    const { isDarkMode, toggleTheme } = useTheme()

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 h-[8vh] ${theme.bg.overlay} shadow-sm border-b ${theme.border.default}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => router.push('/')}
                >
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-base">AI</span>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className={`text-base font-bold ${theme.text.main}`}>InpaintAI</h1>
                        <p className={`text-[10px] ${theme.text.muted}`}>AI-Powered Editing</p>
                    </div>
                </motion.div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-6">
                    <button
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`text-sm ${theme.button.secondary} hover:${theme.text.accent} font-medium transition-colors`}
                    >
                        Features
                    </button>
                    <button
                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`text-sm ${theme.button.secondary} hover:${theme.text.accent} font-medium transition-colors`}
                    >
                        How It Works
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className={theme.button.icon}
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDarkMode ? '🌙' : '☀️'}
                    </motion.button>

                    {/* Get Started Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/app')}
                        className={theme.button.primary}
                    >
                        Get Started
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar
