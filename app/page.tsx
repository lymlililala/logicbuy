// Root page — middleware will redirect / → /en or /zh based on Accept-Language
// This file is kept as a fallback but should never be rendered directly
import { redirect } from 'next/navigation'

export default function RootPage() {
  // Fallback redirect to English (middleware should handle this before reaching here)
  redirect('/en')
}
