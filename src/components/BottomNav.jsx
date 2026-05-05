import { BookOpen, Home, Scroll, Search, Wind } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/library', icon: Wind, label: 'Library' },
  { path: '/poetry', icon: BookOpen, label: 'Poetry' },
  { path: '/diary', icon: Scroll, label: 'Diary' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/10 bg-brand-surface/95 backdrop-blur-xl md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs transition-colors ${
              isActive ? 'text-brand-accent' : 'text-brand-muted hover:text-white'
            }`}
            aria-label={item.label}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
