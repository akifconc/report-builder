"use client"

import { Button } from "@/components/ui/button"
import { FileText, BarChart3, Table, ImageIcon, Zap, Users, Target } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Report Builder</span>
          </div>
          <div className="text-sm text-gray-500">Professional Report Creation Tool</div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Professional
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Reports</span>
            <br />
            in Minutes
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Build stunning, data-driven reports with our intuitive drag-and-drop interface. 
            Add charts, tables, images, and text to create professional documents that impress.
          </p>

          {/* Subtle Pulsating CTA Button */}
          <div className="mb-20 relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm animate-pulse opacity-30"></div>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="relative px-12 py-6 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <Zap className="w-6 h-6 mr-3" />
              TRY IT NOW!
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Charts</h3>
              <p className="text-gray-600">Create beautiful bar, line, and pie charts with real-time data visualization.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Table className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Dynamic Tables</h3>
              <p className="text-gray-600">Build responsive tables with custom headers, data, and professional styling.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rich Media</h3>
              <p className="text-gray-600">Add images, custom text formatting, and multimedia elements seamlessly.</p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-white/50 rounded-lg p-4">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-gray-700 font-medium">Team Collaboration</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 rounded-lg p-4">
              <Target className="w-6 h-6 text-green-600" />
              <span className="text-gray-700 font-medium">Professional Templates</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 rounded-lg p-4">
              <Zap className="w-6 h-6 text-purple-600" />
              <span className="text-gray-700 font-medium">Instant Export</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="text-center text-gray-500">
          <p>Built with Next.js, React, and modern web technologies</p>
        </div>
      </div>
    </div>
  )
} 