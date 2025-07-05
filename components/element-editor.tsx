"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Minus } from "lucide-react"

interface ElementEditorProps {
  element: any
  onUpdate: (content: any) => void
  onDelete: () => void
}

export default function ElementEditor({ element, onUpdate, onDelete }: ElementEditorProps) {
  const [content, setContent] = useState(element.content)

  const handleUpdate = (updates: any) => {
    const newContent = { ...content, ...updates }
    setContent(newContent)
    onUpdate(newContent)
  }

  const renderEditor = () => {
    switch (element.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text Content</Label>
              <Textarea
                id="text"
                value={content.text}
                onChange={(e) => handleUpdate({ text: e.target.value })}
                placeholder="Enter your text"
              />
            </div>
            <div>
              <Label htmlFor="fontSize">Font Size</Label>
              <Input
                id="fontSize"
                type="number"
                value={content.fontSize}
                onChange={(e) => handleUpdate({ fontSize: Number.parseInt(e.target.value) })}
                min="8"
                max="72"
              />
            </div>
            <div>
              <Label htmlFor="fontWeight">Font Weight</Label>
              <Select value={content.fontWeight} onValueChange={(value) => handleUpdate({ fontWeight: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="lighter">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="color">Text Color</Label>
              <Input
                id="color"
                type="color"
                value={content.color}
                onChange={(e) => handleUpdate({ color: e.target.value })}
              />
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                value={content.src}
                onChange={(e) => handleUpdate({ src: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={content.alt}
                onChange={(e) => handleUpdate({ alt: e.target.value })}
                placeholder="Enter alt text"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={content.width}
                  onChange={(e) => handleUpdate({ width: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={content.height}
                  onChange={(e) => handleUpdate({ height: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )

      case "table":
        return (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Headers</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newHeaders = [...content.headers, `Column ${content.headers.length + 1}`]
                    const newRows = content.rows.map((row: string[]) => [...row, ""])
                    handleUpdate({ headers: newHeaders, rows: newRows })
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {content.headers.map((header: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={header}
                    onChange={(e) => {
                      const newHeaders = [...content.headers]
                      newHeaders[index] = e.target.value
                      handleUpdate({ headers: newHeaders })
                    }}
                    placeholder={`Header ${index + 1}`}
                  />
                  {content.headers.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newHeaders = content.headers.filter((_: any, i: number) => i !== index)
                        const newRows = content.rows.map((row: string[]) =>
                          row.filter((_: any, i: number) => i !== index),
                        )
                        handleUpdate({ headers: newHeaders, rows: newRows })
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Rows</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newRow = new Array(content.headers.length).fill("")
                    handleUpdate({ rows: [...content.rows, newRow] })
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {content.rows.map((row: string[], rowIndex: number) => (
                <div key={rowIndex} className="space-y-2 mb-4 p-2 border rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Row {rowIndex + 1}</span>
                    {content.rows.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newRows = content.rows.filter((_: any, i: number) => i !== rowIndex)
                          handleUpdate({ rows: newRows })
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {row.map((cell: string, cellIndex: number) => (
                    <Input
                      key={cellIndex}
                      value={cell}
                      onChange={(e) => {
                        const newRows = [...content.rows]
                        newRows[rowIndex][cellIndex] = e.target.value
                        handleUpdate({ rows: newRows })
                      }}
                      placeholder={`${content.headers[cellIndex]} data`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )

      case "chart":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Chart Title</Label>
              <Input
                id="title"
                value={content.title}
                onChange={(e) => handleUpdate({ title: e.target.value })}
                placeholder="Enter chart title"
              />
            </div>
            <div>
              <Label htmlFor="chartType">Chart Type</Label>
              <Select value={content.type} onValueChange={(value) => handleUpdate({ type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Data Points</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newData = [...content.data, { name: `Item ${content.data.length + 1}`, value: 0 }]
                    handleUpdate({ data: newData })
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {content.data.map((item: any, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={item.name}
                    onChange={(e) => {
                      const newData = [...content.data]
                      newData[index].name = e.target.value
                      handleUpdate({ data: newData })
                    }}
                    placeholder="Label"
                  />
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) => {
                      const newData = [...content.data]
                      newData[index].value = Number.parseInt(e.target.value) || 0
                      handleUpdate({ data: newData })
                    }}
                    placeholder="Value"
                  />
                  {content.data.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newData = content.data.filter((_: any, i: number) => i !== index)
                        handleUpdate({ data: newData })
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return <div>No editor available for this element type</div>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium capitalize">{element.type} Properties</h3>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      {renderEditor()}
    </div>
  )
}
