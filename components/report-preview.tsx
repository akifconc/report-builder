"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shuffle, Download } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ReportPreviewProps {
  report: any
  onClose: () => void
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const sampleData = {
  text: [
    "Q4 2024 Performance Report",
    "Executive Summary: Our company achieved exceptional growth this quarter.",
    "Key Highlights: Revenue increased by 25% compared to last quarter.",
    "Market Analysis: Strong performance across all segments.",
    "Financial Overview: Profit margins improved significantly.",
  ],
  table: {
    sales: {
      headers: ["Month", "Revenue", "Growth %", "Target"],
      rows: [
        ["January", "$125,000", "15%", "$120,000"],
        ["February", "$142,000", "22%", "$130,000"],
        ["March", "$158,000", "18%", "$140,000"],
        ["April", "$175,000", "28%", "$150,000"],
      ],
    },
    employees: {
      headers: ["Department", "Employees", "New Hires", "Retention %"],
      rows: [
        ["Engineering", "45", "8", "94%"],
        ["Sales", "32", "5", "91%"],
        ["Marketing", "18", "3", "96%"],
        ["Support", "25", "4", "89%"],
      ],
    },
  },
  chart: {
    revenue: [
      { name: "Jan", value: 125000 },
      { name: "Feb", value: 142000 },
      { name: "Mar", value: 158000 },
      { name: "Apr", value: 175000 },
      { name: "May", value: 192000 },
      { name: "Jun", value: 208000 },
    ],
    departments: [
      { name: "Engineering", value: 45 },
      { name: "Sales", value: 32 },
      { name: "Marketing", value: 18 },
      { name: "Support", value: 25 },
    ],
    growth: [
      { name: "Q1", value: 15 },
      { name: "Q2", value: 22 },
      { name: "Q3", value: 18 },
      { name: "Q4", value: 28 },
    ],
  },
}

export default function ReportPreview({ report, onClose }: ReportPreviewProps) {
  const [useSampleData, setUseSampleData] = useState(false)
  const [backendSampleData, setBackendSampleData] = useState<any>(null)

  const getRandomSampleText = () => {
    if (backendSampleData?.text) {
      return backendSampleData.text[Math.floor(Math.random() * backendSampleData.text.length)]
    }
    return sampleData.text[Math.floor(Math.random() * sampleData.text.length)]
  }

  const getRandomSampleImage = () => {
    // Fallback sample images - Report-relevant placeholders
    const fallbackImages = [
      { src: "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Q4+Revenue+Chart", alt: "Quarterly revenue performance chart", width: 800, height: 400 },
      { src: "https://via.placeholder.com/600x800/059669/FFFFFF?text=Growth+Metrics+Infographic", alt: "Company growth metrics infographic", width: 600, height: 800 },
      { src: "https://via.placeholder.com/400x200/DC2626/FFFFFF?text=Company+Logo", alt: "Company logo and branding", width: 400, height: 200 },
      { src: "https://via.placeholder.com/700x500/7C3AED/FFFFFF?text=Process+Flow+Diagram", alt: "Business process flow diagram", width: 700, height: 500 },
      { src: "https://via.placeholder.com/800x600/EA580C/FFFFFF?text=Product+Mockup", alt: "Product design mockup", width: 800, height: 600 },
    ]

    if (backendSampleData?.image) {
      const images = Object.values(backendSampleData.image)
      if (images.length > 0) {
        const selected = images[Math.floor(Math.random() * images.length)] as any
        // Ensure the selected image has the required properties
        if (selected && selected.src) {
          return selected
        }
      }
    }
    
    // Always return a fallback image
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
  }

  const getRandomSampleTable = () => {
    if (backendSampleData?.table) {
      const tables = Object.values(backendSampleData.table)
      return tables[Math.floor(Math.random() * tables.length)]
    }
    const tables = Object.values(sampleData.table)
    return tables[Math.floor(Math.random() * tables.length)]
  }

  const getRandomSampleChart = () => {
    if (backendSampleData?.chart) {
      const charts = Object.values(backendSampleData.chart)
      const selected = charts[Math.floor(Math.random() * charts.length)] as any
      return selected?.data || selected
    }
    const charts = Object.values(sampleData.chart)
    return charts[Math.floor(Math.random() * charts.length)]
  }

  const populateWithSampleData = async () => {
    try {
      // Initialize sample data in backend if not already done
      await fetch("http://localhost:8000/initialize-sample-data", {
        method: "POST",
      })
      
      // Fetch sample data from backend
      const response = await fetch("http://localhost:8000/sample-data")
      if (response.ok) {
        const data = await response.json()
        
        // Organize data by type
        const organized = {
          text: data.filter((item: any) => item.data_type === "text").map((item: any) => item.data.text),
          image: {},
          table: {},
          chart: {}
        }
        
        // Organize images by category
        data.filter((item: any) => item.data_type === "image").forEach((item: any) => {
          (organized.image as any)[item.category] = item.data
        })
        
        // Organize tables by category
        data.filter((item: any) => item.data_type === "table").forEach((item: any) => {
          (organized.table as any)[item.category] = item.data
        })
        
        // Organize charts by category
        data.filter((item: any) => item.data_type === "chart").forEach((item: any) => {
          (organized.chart as any)[item.category] = item.data.data // Extract the actual data array
        })
        
        setBackendSampleData(organized)
      }
    } catch (error) {
      console.error("Error fetching sample data:", error)
    }
    
    setUseSampleData(true)
  }

  const exportToPDF = () => {
    // Use browser's built-in print functionality to save as PDF
    window.print()
  }

  const renderChart = (element: any) => {
    let rawData = useSampleData ? getRandomSampleChart() : element.content.data
    let data: any[] = []

    // Handle different data structures
    if (Array.isArray(rawData)) {
      data = rawData
    } else if (rawData && typeof rawData === 'object' && Array.isArray((rawData as any).data)) {
      // Backend sample data structure
      data = (rawData as any).data
    } else if (rawData && typeof rawData === 'object' && (rawData as any).data) {
      // Nested data structure
      data = Array.isArray((rawData as any).data) ? (rawData as any).data : []
    } else {
      // Default fallback data
      data = [
        { name: "Sample 1", value: 100 },
        { name: "Sample 2", value: 200 },
        { name: "Sample 3", value: 150 },
      ]
    }

    // If data is empty, provide default data
    if (data.length === 0) {
      data = [
        { name: "No Data", value: 0 },
      ]
    }

    // Ensure each data item has required properties
    data = data.map((item: any, index: number) => ({
      name: item.name || `Item ${index + 1}`,
      value: typeof item.value === 'number' ? item.value : 0,
    }))

    switch (element.content.type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="flex flex-col h-full">
      <style jsx global>{`
        @media print {
          .print-hide {
            display: none !important;
          }
          .print-optimize {
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
      
      <div className="border-b p-4 flex justify-between items-center print-hide">
        <h2 className="text-lg font-semibold">Report Preview</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={populateWithSampleData} className="flex items-center gap-2 bg-transparent">
            <Shuffle className="w-4 h-4" />
            Populate with Sample Data
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto bg-gray-50 print-optimize">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg print:shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">{report.name}</CardTitle>
              {report.description && <p className="text-gray-600">{report.description}</p>}
            </CardHeader>
            <CardContent className="space-y-8">
              {report.layout.map((element: any) => (
                <div key={element.id} className="break-inside-avoid">
                  {element.type === "text" && (
                    <div
                      style={{
                        fontSize: element.content.fontSize,
                        fontWeight: element.content.fontWeight,
                        color: element.content.color,
                        lineHeight: 1.6,
                      }}
                    >
                      {useSampleData ? getRandomSampleText() : element.content.text}
                    </div>
                  )}

                  {element.type === "image" && (
                    <div className="text-center">
                      {(() => {
                        const imageData = useSampleData ? getRandomSampleImage() : element.content
                        return (
                          <img
                            src={imageData.src || "/placeholder.svg"}
                            alt={imageData.alt || "Image"}
                            width={element.content.width || imageData.width || 400}
                            height={element.content.height || imageData.height || 300}
                            className="rounded-lg shadow-sm mx-auto"
                          />
                        )
                      })()}
                    </div>
                  )}

                  {element.type === "table" && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 bg-white">
                        <thead>
                          <tr className="bg-gray-50">
                            {(useSampleData ? getRandomSampleTable().headers : element.content.headers).map(
                              (header: string, index: number) => (
                                <th key={index} className="border border-gray-300 px-4 py-3 text-left font-semibold">
                                  {header}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {(useSampleData ? getRandomSampleTable().rows : element.content.rows).map(
                            (row: any, rowIndex: number) => (
                              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                {Array.isArray(row) && row.map((cell: any, cellIndex: number) => (
                                  <td key={cellIndex} className="border border-gray-300 px-4 py-3">
                                    {String(cell)}
                                  </td>
                                ))}
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {element.type === "chart" && (
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4 text-center">{element.content.title}</h3>
                      {renderChart(element)}
                    </div>
                  )}
                </div>
              ))}

              {report.layout.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>This report is empty. Add some elements to see the preview.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
