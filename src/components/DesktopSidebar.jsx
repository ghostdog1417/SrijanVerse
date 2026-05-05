import { BookOpen, Home, Moon, Scroll, Search, Sun, Wind } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/library', icon: Wind, label: 'Library' },
  { path: '/poetry', icon: BookOpen, label: 'Poetry' },
  { path: '/diary', icon: Scroll, label: 'Diary' },
]

export default function DesktopSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, setTheme } = usePlayer()

  return (
    <aside className="hidden md:flex md:w-[280px] md:flex-col md:border-r md:border-white/10 md:bg-brand-surface/50 md:backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">SrijanVerse</h1>
        <p className="mt-1 text-sm text-brand-muted">Srijan Dwivedi</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-brand-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className="transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-brand-muted transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  )
}
