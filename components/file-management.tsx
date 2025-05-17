"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Trash2, RefreshCw, FileText, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FileItem {
  key: string
  lastModified: Date
  size: number
  url: string
}

export default function FileManagement() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)
  const { toast } = useToast()

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/s3/list")
      if (!response.ok) throw new Error("Failed to fetch files")
      const data = await response.json()

      // Check if we're in preview mode
      if (data.isPreview) {
        setIsPreview(true)
      }

      setFiles(data.files || [])
    } catch (error) {
      console.error("Error fetching files:", error)
      toast({
        title: "Error",
        description: "Failed to load files from S3",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get("file") as File

    if (!file || file.size === 0) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/s3/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!response.ok) throw new Error("Failed to upload file")

      const data = await response.json()

      toast({
        title: "Success",
        description: data.message || "File uploaded successfully",
      })

      // Reset the form
      e.currentTarget.reset()

      // Refresh the file list
      fetchFiles()
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Error",
        description: "Failed to upload file to S3",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteFile = async (key: string) => {
    if (!confirm(`Are you sure you want to delete ${key}?`)) return

    try {
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      })

      if (!response.ok) throw new Error("Failed to delete file")

      const data = await response.json()

      toast({
        title: "Success",
        description: data.message || "File deleted successfully",
      })

      // Refresh the file list
      fetchFiles()
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Error",
        description: "Failed to delete file from S3",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {isPreview && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Preview Mode</AlertTitle>
          <AlertDescription className="text-amber-700">
            You are viewing this application in preview mode with mock data. AWS S3 operations are simulated.
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Upload File to S3</h2>
        <form onSubmit={handleFileUpload} className="flex flex-col sm:flex-row gap-4">
          <Input type="file" name="file" className="flex-1" required />
          <Button type="submit" disabled={isUploading}>
            {isUploading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </form>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Files in S3</h2>
          <Button variant="outline" onClick={fetchFiles} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No files found in S3 bucket</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <Card key={file.key} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3 overflow-hidden">
                      <FileText className="h-5 w-5 flex-shrink-0 mt-1" />
                      <div className="overflow-hidden">
                        <p className="font-medium truncate" title={file.key}>
                          {file.key}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(file.lastModified).toLocaleString()} · {formatBytes(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteFile(file.key)}
                      className="flex-shrink-0 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {file.url && (
                    <div className="mt-3">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View file
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
