'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar/Navbar'
import { useTypingEffect } from '../hooks/useTypingEffect'
import { theme } from '../theme'

export default function Home() {
    const router = useRouter()

    // Typing effect for dynamic headline
    const typingWords = ['Like Magic', 'Instantly', 'Effortlessly', 'Perfectly']
    const typedText = useTypingEffect(typingWords, 120, 80, 2000)

    const features = [
        { icon: '🎨', title: 'AI-Powered', description: 'Advanced GAN technology for intelligent object removal' },
        { icon: '⚡', title: 'Lightning Fast', description: 'Process images in seconds with optimized algorithms' },
        { icon: '🎯', title: 'Precise Control', description: 'Draw exactly what you want to remove with our canvas tool' },
        { icon: '📱', title: 'Fully Responsive', description: 'Works perfectly on mobile, tablet, and desktop' }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className={theme.bg.page}>
            {/* Navbar - 10vh */}
            <Navbar />

            {/* Hero Section - 90vh */}
            <section className="relative h-[92vh] mt-[8vh] flex items-center justify-center overflow-hidden">
                {/* Animated Background Blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl"
                />

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"
                        />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">AI-Powered Image Editing</span>
                    </motion.div>

                    {/* Headline with Typing Effect */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-6"
                    >
                        Remove Objects
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent inline-flex items-center gap-2">
                            {typedText}
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-1 h-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500"
                            />
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg sm:text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-10"
                    >
                        Professional AI-powered image inpainting. Remove unwanted objects, people, or text from your photos in seconds.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/app')}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Get Started Free
                                <motion.svg
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </motion.svg>
                            </span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                            className={`w-full sm:w-auto ${theme.button.secondary} text-lg shadow-md hover:shadow-lg`}
                        >
                            Learn More
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section - 100vh */}
            <section id="features" className={`relative min-h-screen flex items-center justify-center ${theme.bg.card} py-20`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${theme.text.main} mb-4`}>
                            Powerful Features
                        </h2>
                        <p className={`text-lg sm:text-xl ${theme.text.secondary} max-w-2xl mx-auto`}>
                            Everything you need for professional image editing
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className={`p-8 ${theme.card} shadow-md hover:shadow-xl transition-all duration-300`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    className="text-5xl mb-4"
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className={`text-xl font-bold ${theme.text.main} mb-2`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-base ${theme.text.secondary}`}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section - 100vh */}
            <section id="how-it-works" className={`relative min-h-screen flex items-center justify-center ${theme.bg.page} py-20`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Simple 4-step process to perfect images
                        </p>
                    </motion.div>

                    {/* Steps */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[
                            { step: '1', title: 'Upload', desc: 'Choose your image', icon: '📁' },
                            { step: '2', title: 'Mask', desc: 'Draw over objects', icon: '✏️' },
                            { step: '3', title: 'Configure', desc: 'Adjust settings', icon: '⚙️' },
                            { step: '4', title: 'Download', desc: 'Get perfect result', icon: '⬇️' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="relative text-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-20 h-20 mx-auto mb-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg"
                                >
                                    {item.step}
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    className="text-4xl mb-4"
                                >
                                    {item.icon}
                                </motion.div>

                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-base text-zinc-600 dark:text-zinc-400">
                                    {item.desc}
                                </p>

                                {index < 3 && (
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="hidden lg:block absolute top-10 -right-4 text-blue-600 dark:text-blue-500"
                                    >
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section - 100vh */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 dark:from-blue-800 dark:via-blue-900 dark:to-purple-900 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
                    >
                        Ready to Get Started?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl sm:text-2xl text-blue-100 mb-10"
                    >
                        Join thousands of users creating perfect images with AI
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/app')}
                        className="px-10 py-5 bg-white hover:bg-zinc-50 text-blue-600 rounded-xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300"
                    >
                        Start Editing Now →
                    </motion.button>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
                    >
                        {[
                            { value: '10K+', label: 'Images Processed' },
                            { value: '5K+', label: 'Happy Users' },
                            { value: '99%', label: 'Satisfaction' }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.1 }}
                            >
                                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-blue-200 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-zinc-900 dark:bg-zinc-950 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
                                    AI
                                </div>
                                <span className="text-lg font-bold">Inpainting Studio</span>
                            </div>
                            <p className="text-zinc-400 text-sm">
                                Professional AI-powered image editing tool for removing unwanted objects.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                                <li><button onClick={() => router.push('/app')} className="hover:text-white transition-colors">Get Started</button></li>
                                <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Features</button></li>
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="font-semibold mb-4">Connect</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="https://github.com/likithsurya23"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.linkedin.com/in/likith--d"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                        LinkedIn
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-8 text-center text-sm text-zinc-400">
                        © 2025 AI Image Inpainting Studio. Made with ❤️ by Likith D
                    </div>
                </div>
            </footer>
        </div>
    )
}
