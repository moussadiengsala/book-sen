import type { Book, Category } from "../types"

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Fiction",
    description: "Fictional books and novels",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "2",
    name: "Non-Fiction",
    description: "Educational and informative books",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "3",
    name: "Science Fiction",
    description: "Books about futuristic science and technology",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "4",
    name: "Mystery",
    description: "Books involving mysteries and detective work",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "5",
    name: "Biography",
    description: "Books about real people's lives",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
]

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    description: "A novel about the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.",
    author: "F. Scott Fitzgerald",
    categoryId: "1",
    coverUrl: "/placeholder.svg?height=400&width=300",
    createdAt: new Date(2023, 1, 10).toISOString(),
    updatedAt: new Date(2023, 1, 10).toISOString(),
  },
  {
    id: "2",
    title: "Sapiens: A Brief History of Humankind",
    description: "A book that explores the history of the human species from the evolution of archaic human species.",
    author: "Yuval Noah Harari",
    categoryId: "2",
    coverUrl: "/placeholder.svg?height=400&width=300",
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: "3",
    title: "Dune",
    description: "A science fiction novel set in the distant future amidst a feudal interstellar society.",
    author: "Frank Herbert",
    categoryId: "3",
    coverUrl: "/placeholder.svg?height=400&width=300",
    createdAt: new Date(2023, 2, 5).toISOString(),
    updatedAt: new Date(2023, 2, 5).toISOString(),
  },
  {
    id: "4",
    title: "The Silent Patient",
    description: "A psychological thriller about a woman who shoots her husband and then stops speaking.",
    author: "Alex Michaelides",
    categoryId: "4",
    coverUrl: "/placeholder.svg?height=400&width=300",
    createdAt: new Date(2023, 2, 20).toISOString(),
    updatedAt: new Date(2023, 2, 20).toISOString(),
  },
  {
    id: "5",
    title: "Steve Jobs",
    description: "The biography of Apple co-founder Steve Jobs.",
    author: "Walter Isaacson",
    categoryId: "5",
    coverUrl: "/placeholder.svg?height=400&width=300",
    createdAt: new Date(2023, 3, 1).toISOString(),
    updatedAt: new Date(2023, 3, 1).toISOString(),
  },
  {
    id: "6",
    title: "To Kill a Mockingbird",
    description: "A novel about racial inequality and moral growth in the American South.",
    author: "Harper Lee",
    categoryId: "1",
    coverUrl: "/placeholder.svg?height=400&width=300",
    createdAt: new Date(2023, 3, 15).toISOString(),
    updatedAt: new Date(2023, 3, 15).toISOString(),
  },
  {
    id: "7",
    title: "Thinking, Fast and Slow",
    description: "A book about the two systems that drive the way we think and make choices.",
    author: "Daniel Kahneman",
    categoryId: "2",
    coverUrl: "/placeholder.svg?height=400&width=300",
    createdAt: new Date(2023, 4, 1).toISOString(),
    updatedAt: new Date(2023, 4, 1).toISOString(),
  },
  {
    id: "8",
    title: "Foundation",
    description:
      "A science fiction novel about a mathematician who develops a branch of mathematics that can predict the future.",
    author: "Isaac Asimov",
    categoryId: "3",
    coverUrl: "/placeholder.svg?height=400&width=300",
    createdAt: new Date(2023, 4, 15).toISOString(),
    updatedAt: new Date(2023, 4, 15).toISOString(),
  },
]

// Helper functions to work with mock data
export function getBooks(): Book[] {
  return [...mockBooks]
}

export function getBook(id: string): Book | undefined {
  return mockBooks.find((book) => book.id === id)
}

export function getCategories(): Category[] {
  return [...mockCategories]
}

export function getCategory(id: string): Category | undefined {
  return mockCategories.find((category) => category.id === id)
}

export function getCategoryName(id: string): string {
  const category = getCategory(id)
  return category ? category.name : "Unknown Category"
}

// In a real app, these would be API calls
export function addBook(book: Omit<Book, "id" | "createdAt" | "updatedAt">): Book {
  const newBook: Book = {
    ...book,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockBooks.push(newBook)
  return newBook
}

export function updateBook(id: string, book: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>): Book | undefined {
  const index = mockBooks.findIndex((b) => b.id === id)
  if (index === -1) return undefined

  mockBooks[index] = {
    ...mockBooks[index],
    ...book,
    updatedAt: new Date().toISOString(),
  }

  return mockBooks[index]
}

export function deleteBook(id: string): boolean {
  const index = mockBooks.findIndex((b) => b.id === id)
  if (index === -1) return false

  mockBooks.splice(index, 1)
  return true
}

export function addCategory(category: Omit<Category, "id" | "createdAt" | "updatedAt">): Category {
  const newCategory: Category = {
    ...category,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockCategories.push(newCategory)
  return newCategory
}

export function updateCategory(
  id: string,
  category: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>,
): Category | undefined {
  const index = mockCategories.findIndex((c) => c.id === id)
  if (index === -1) return undefined

  mockCategories[index] = {
    ...mockCategories[index],
    ...category,
    updatedAt: new Date().toISOString(),
  }

  return mockCategories[index]
}

export function deleteCategory(id: string): boolean {
  // Check if any books use this category
  const booksWithCategory = mockBooks.filter((book) => book.categoryId === id)
  if (booksWithCategory.length > 0) {
    return false // Can't delete category that has books
  }

  const index = mockCategories.findIndex((c) => c.id === id)
  if (index === -1) return false

  mockCategories.splice(index, 1)
  return true
}
