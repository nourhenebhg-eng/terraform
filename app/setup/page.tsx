"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Check, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSetup = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/setup")

      if (!response.ok) {
        throw new Error("Failed to set up database")
      }

      const data = await response.json()

      if (data.isPreview) {
        setIsPreview(true)
      }

      setSetupComplete(true)
      toast({
        title: "Success",
        description: data.message || "Database setup completed successfully",
      })
    } catch (error) {
      console.error("Error setting up database:", error)
      toast({
        title: "Error",
        description: "Failed to set up database. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Application Setup</CardTitle>
          <CardDescription>Set up the database tables required for the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isPreview ? (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Preview Mode</AlertTitle>
                <AlertDescription className="text-amber-700">
                  You are viewing this application in preview mode. Database setup is simulated.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Important</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>Make sure you have configured the following environment variables:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>AWS_ACCESS_KEY_ID</li>
                        <li>AWS_SECRET_ACCESS_KEY</li>
                        <li>AWS_REGION</li>
                        <li>AWS_S3_BUCKET_NAME</li>
                        <li>POSTGRES_URL</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={handleSetup} disabled={isLoading || setupComplete}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Setting Up...
              </>
            ) : setupComplete ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Setup Complete
              </>
            ) : (
              "Initialize Database"
            )}
          </Button>

          {setupComplete && (
            <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
              Go to Application
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
