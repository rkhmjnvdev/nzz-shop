import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'NZZ Computers | Performance Hardware', description: 'Premium PC components, custom PC builder and gaming PCs.' }
export const viewport: Viewport = { themeColor: '#080b10' }
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}{process.env.NODE_ENV==='production'&&<Analytics/>}</body></html> }
