import './globals.css'

export const metadata = {
  title: 'HubSpace Prague',
  description: 'Moderní coworkingové centrum',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  )
}