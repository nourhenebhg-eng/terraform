import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileManagement from "@/components/file-management"
import UserManagement from "@/components/user-management"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">AWS S3 & RDS Integration</h1>

      <Tabs defaultValue="files" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="files">File Management (S3)</TabsTrigger>
          <TabsTrigger value="users">User Management (RDS)</TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="p-4 border rounded-md mt-2">
          <FileManagement />
        </TabsContent>
        <TabsContent value="users" className="p-4 border rounded-md mt-2">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </main>
  )
}
