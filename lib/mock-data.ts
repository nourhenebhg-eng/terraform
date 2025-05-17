// Mock data for preview environment
export const mockFiles = [
  {
    key: "sample-document.pdf",
    lastModified: new Date(2023, 5, 15),
    size: 1024 * 1024 * 2.5, // 2.5 MB
    url: "https://example.com/sample-document.pdf",
  },
  {
    key: "profile-image.jpg",
    lastModified: new Date(2023, 6, 20),
    size: 1024 * 512, // 512 KB
    url: "https://example.com/profile-image.jpg",
  },
  {
    key: "presentation.pptx",
    lastModified: new Date(2023, 7, 10),
    size: 1024 * 1024 * 5, // 5 MB
    url: "https://example.com/presentation.pptx",
  },
  {
    key: "data-export.csv",
    lastModified: new Date(2023, 8, 5),
    size: 1024 * 256, // 256 KB
    url: "https://example.com/data-export.csv",
  },
]

export const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    image_url: "https://randomuser.me/api/portraits/men/1.jpg",
    created_at: new Date(2023, 4, 10).toISOString(),
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    image_url: "https://randomuser.me/api/portraits/women/2.jpg",
    created_at: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    image_url: null,
    created_at: new Date(2023, 6, 20).toISOString(),
  },
]

// In-memory storage for mock data
// Using let for these variables so they can be modified
export let inMemoryFiles = [...mockFiles]
export let inMemoryUsers = [...mockUsers]

// Helper to generate a unique ID for new mock items
export function generateMockId() {
  return Math.floor(Math.random() * 10000)
}

// Reset mock data to initial state
export function resetMockData() {
  inMemoryFiles = [...mockFiles]
  inMemoryUsers = [...mockUsers]
}
