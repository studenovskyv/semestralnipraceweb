import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Reserva.io
            </span>
            <div className="space-x-4">
              <a href="/" className="text-sm font-medium hover:text-blue-600">Domů</a>
              <a href="/admin" className="text-sm px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition">Admin Panel</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}