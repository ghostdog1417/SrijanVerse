import { Outlet } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'
import BottomNav from './BottomNav'
import DesktopSidebar from './DesktopSidebar'
import MiniPlayer from './MiniPlayer'

export default function Layout() {
  const { theme } = usePlayer()

  return (
    <div className={`relative min-h-screen bg-brand-bg text-white ${theme === 'light' ? 'theme-light' : ''}`}>
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(80,58,107,0.28),transparent_52%),radial-gradient(circle_at_70%_18%,rgba(198,162,64,0.14),transparent_40%),radial-gradient(circle_at_20%_80%,rgba(124,83,145,0.18),transparent_48%)]" />

      <div className="relative flex min-h-screen flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <DesktopSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-32 md:pb-24">
          <Outlet />
        </main>

        {/* Mini Player (Fixed bottom on mobile, sticky on desktop) */}
        <MiniPlayer />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
