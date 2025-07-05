"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { GripVertical, Type, ImageIcon, Table, BarChart3 } from "lucide-react"

interface SortableElementProps {
  element: any
  isSelected: boolean
  onSelect: () => void
}

export default function SortableElement({ element, isSelected, onSelect }: SortableElementProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getIcon = () => {
    switch (element.type) {
      case "text":
        return <Type className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "table":
        return <Table className="w-4 h-4" />
      case "chart":
        return <BarChart3 className="w-4 h-4" />
      default:
        return null
    }
  }

  const renderPreview = () => {
    switch (element.type) {
      case "text":
        return (
          <div
            style={{
              fontSize: element.content.fontSize,
              fontWeight: element.content.fontWeight,
              color: element.content.color,
            }}
          >
            {element.content.text}
          </div>
        )
      case "image":
        return (
          <img
            src={element.content.src || "/placeholder.svg"}
            alt={element.content.alt}
            width={Math.min(element.content.width, 200)}
            height={Math.min(element.content.height, 100)}
            className="rounded"
          />
        )
      case "table":
        return (
          <div className="text-sm">
            <div className="font-medium">
              Table ({element.content.headers.length} columns, {element.content.rows.length} rows)
            </div>
            <div className="text-gray-500">Headers: {element.content.headers.join(", ")}</div>
          </div>
        )
      case "chart":
        return (
          <div className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-gray-400" />
            <div>
              <div className="font-medium">{element.content.title}</div>
              <div className="text-sm text-gray-500">{element.content.type} chart</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer transition-colors ${isSelected ? "ring-2 ring-blue-500" : "hover:bg-gray-50"}`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="cursor-grab active:cursor-grabbing mt-1" {...attributes} {...listeners}>
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            {getIcon()}
            <span className="text-sm font-medium capitalize">{element.type}</span>
          </div>
          <div className="flex-1 min-w-0">{renderPreview()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
