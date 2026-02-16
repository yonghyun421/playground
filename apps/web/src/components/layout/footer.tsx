export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Playground. All rights reserved.</p>
      </div>
    </footer>
  )
}
