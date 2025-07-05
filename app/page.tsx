"use client"

import { useState, useEffect } from "react"
import { Plus, FileText, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReportBuilder from "@/components/report-builder"
import ReportPreview from "@/components/report-preview"
import LandingPage from "@/components/landing-page"

interface Report {
  id: string
  name: string
  description: string
  layout: any[]
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [newReportName, setNewReportName] = useState("")
  const [newReportDescription, setNewReportDescription] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentView, setCurrentView] = useState<"landing" | "dashboard" | "edit" | "preview">("landing")

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:8000/reports")
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    }
  }

  const createReport = async () => {
    try {
      const response = await fetch("http://localhost:8000/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newReportName,
          description: newReportDescription,
          layout: [],
        }),
      })

      if (response.ok) {
        const newReport = await response.json()
        setReports([...reports, newReport])
        setNewReportName("")
        setNewReportDescription("")
        setIsCreateDialogOpen(false)
        setSelectedReport(newReport)
        setCurrentView("edit")
      }
    } catch (error) {
      console.error("Error creating report:", error)
    }
  }

  const deleteReport = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/reports/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setReports(reports.filter((report) => report.id !== id))
      }
    } catch (error) {
      console.error("Error deleting report:", error)
    }
  }

  const handleSaveReport = async (layout: any[]) => {
    if (!selectedReport) return

    const response = await fetch(`http://localhost:8000/reports/${selectedReport.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        layout,
      }),
    })

    if (response.ok) {
      const updatedReport = await response.json()
      setReports(reports.map((report) => (report.id === selectedReport.id ? updatedReport : report)))
      setSelectedReport(updatedReport)
    } else {
      throw new Error("Failed to save report")
    }
  }

  // Landing Page View
  if (currentView === "landing") {
    return <LandingPage onGetStarted={() => setCurrentView("dashboard")} />
  }

  // Dashboard View
  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report Builder</h1>
              <p className="text-gray-600 mt-2">Create and manage your custom reports</p>
            </div>

            {reports.length > 0 && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Report
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {report.name}
                  </CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">{report.layout.length} elements</div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReport(report)
                          setCurrentView("preview")
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReport(report)
                          setCurrentView("edit")
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteReport(report.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto">
                <div className="mb-8">
                  <FileText className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">No reports yet</h3>
                  <p className="text-gray-500 text-lg mb-8">Get started by creating your first report and begin building professional documents with our drag-and-drop interface</p>
                </div>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  size="lg"
                  className="px-8 py-3 text-lg"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Create Your First Report
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Create Report Modal */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>Give your report a name and description to get started.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Report Name</Label>
                <Input
                  id="name"
                  value={newReportName}
                  onChange={(e) => setNewReportName(e.target.value)}
                  placeholder="Enter report name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newReportDescription}
                  onChange={(e) => setNewReportDescription(e.target.value)}
                  placeholder="Enter report description"
                />
              </div>
              <Button onClick={createReport} className="w-full" disabled={!newReportName.trim()}>
                Create Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Edit View  
  if (currentView === "edit" && selectedReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentView("dashboard")}
              >
                ← Back to Reports
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Edit Report: {selectedReport.name}</h1>
                <p className="text-sm text-gray-500">{selectedReport.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentView("preview")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
        
        <div className="h-[calc(100vh-80px)]">
          <ReportBuilder 
            report={selectedReport} 
            onSave={handleSaveReport} 
            onClose={() => setCurrentView("dashboard")} 
          />
        </div>
      </div>
    )
  }

  // Preview View
  if (currentView === "preview" && selectedReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentView("dashboard")}
              >
                ← Back to Reports
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Preview: {selectedReport.name}</h1>
                <p className="text-sm text-gray-500">{selectedReport.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentView("edit")}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
        
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <ReportPreview 
            report={selectedReport} 
            onClose={() => setCurrentView("dashboard")} 
          />
        </div>
      </div>
    )
  }

  return null
}
