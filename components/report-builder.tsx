"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Type, ImageIcon, Table, BarChart3, Save, Eye } from "lucide-react"
import SortableElement from "@/components/sortable-element"
import ElementEditor from "@/components/element-editor"
import { useToast } from "@/hooks/use-toast"

interface ReportElement {
  id: string
  type: "text" | "image" | "table" | "chart"
  content: any
  position: number
}

interface ReportBuilderProps {
  report: any
  onSave: (layout: ReportElement[]) => void
  onClose: () => void
}

export default function ReportBuilder({ report, onSave, onClose }: ReportBuilderProps) {
  const [elements, setElements] = useState<ReportElement[]>(report.layout || [])
  const [selectedElement, setSelectedElement] = useState<ReportElement | null>(null)
  const [activeTab, setActiveTab] = useState("elements")
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const addElement = (type: ReportElement["type"]) => {
    const newElement: ReportElement = {
      id: `element-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      position: elements.length,
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement)
    // Don't auto-switch to properties - let user continue adding elements
  }

  const getDefaultContent = (type: ReportElement["type"]) => {
    switch (type) {
      case "text":
        return { text: "Enter your text here", fontSize: 16, fontWeight: "normal", color: "#000000" }
      case "image":
        return { src: "/placeholder.svg?height=200&width=400", alt: "Placeholder image", width: 400, height: 200 }
      case "table":
        return {
          headers: ["Column 1", "Column 2", "Column 3"],
          rows: [
            ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
            ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
          ],
        }
      case "chart":
        return {
          type: "bar",
          title: "Sample Chart",
          data: [
            { name: "Jan", value: 400 },
            { name: "Feb", value: 300 },
            { name: "Mar", value: 500 },
            { name: "Apr", value: 200 },
          ],
        }
      default:
        return {}
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setElements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        return newItems.map((item, index) => ({ ...item, position: index }))
      })
    }
  }

  const updateElement = (elementId: string, content: any) => {
    setElements(elements.map((el) => (el.id === elementId ? { ...el, content } : el)))
  }

  const deleteElement = (elementId: string) => {
    setElements(elements.filter((el) => el.id !== elementId))
    if (selectedElement?.id === elementId) {
      setSelectedElement(null)
    }
  }

  const handleElementSelect = (element: ReportElement) => {
    setSelectedElement(element)
    setActiveTab("properties") // Auto-switch to properties tab when element is clicked
  }

  const handleSave = async () => {
    try {
      await onSave(elements)
      toast({
        title: "Report saved successfully!",
        description: "Your changes have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error saving report",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const addSampleLayout = () => {
    const sampleElements: ReportElement[] = [
      {
        id: `element-${Date.now()}-1`,
        type: "text",
        content: { text: "Executive Summary Report", fontSize: 24, fontWeight: "bold", color: "#000000" },
        position: 0,
      },
      {
        id: `element-${Date.now()}-2`,
        type: "text",
        content: { text: "This report provides an overview of our quarterly performance and key metrics.", fontSize: 16, fontWeight: "normal", color: "#333333" },
        position: 1,
      },
      {
        id: `element-${Date.now()}-3`,
        type: "chart",
        content: {
          type: "bar",
          title: "Quarterly Revenue Growth",
          data: [
            { name: "Q1", value: 45000 },
            { name: "Q2", value: 52000 },
            { name: "Q3", value: 48000 },
            { name: "Q4", value: 61000 },
          ],
        },
        position: 2,
      },
      {
        id: `element-${Date.now()}-4`,
        type: "table",
        content: {
          headers: ["Department", "Budget", "Actual", "Variance"],
          rows: [
            ["Marketing", "$50,000", "$48,500", "-$1,500"],
            ["Sales", "$75,000", "$78,200", "+$3,200"],
            ["Operations", "$60,000", "$62,100", "+$2,100"],
            ["R&D", "$40,000", "$39,800", "-$200"],
          ],
        },
        position: 3,
      },
      {
        id: `element-${Date.now()}-5`,
        type: "text",
        content: { text: "Key Insights", fontSize: 20, fontWeight: "bold", color: "#000000" },
        position: 4,
      },
      {
        id: `element-${Date.now()}-6`,
        type: "text",
        content: { text: "• Sales exceeded budget by 4.3%, indicating strong market performance\n• Marketing came in under budget while maintaining lead generation targets\n• Overall quarterly performance shows positive growth trajectory", fontSize: 14, fontWeight: "normal", color: "#444444" },
        position: 5,
      },
    ]
    setElements(sampleElements)
    setSelectedElement(null)
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "elements" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Add Elements</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => addElement("text")}
                  >
                    <Type className="w-6 h-6" />
                    Text
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => addElement("image")}
                  >
                    <ImageIcon className="w-6 h-6" />
                    Image
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => addElement("table")}
                  >
                    <Table className="w-6 h-6" />
                    Table
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => addElement("chart")}
                  >
                    <BarChart3 className="w-6 h-6" />
                    Chart
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <Button 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={addSampleLayout}
                >
                  Add Sample Layout
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === "properties" && (
            <div className="h-full">
              {selectedElement ? (
                <ElementEditor
                  element={selectedElement}
                  onUpdate={(content) => updateElement(selectedElement.id, content)}
                  onDelete={() => deleteElement(selectedElement.id)}
                />
              ) : (
                <div className="text-center py-8">
                  <Type className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No element selected</p>
                  <p className="text-gray-400 text-sm">Click on an element or add a new one to edit its properties</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex justify-end items-center">
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{report.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Edit Mode */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext items={elements.map((el) => el.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {elements.map((element) => (
                        <SortableElement
                          key={element.id}
                          element={element}
                          isSelected={selectedElement?.id === element.id}
                          onSelect={() => handleElementSelect(element)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {elements.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Type className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p>Start building your report by adding elements from the sidebar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
