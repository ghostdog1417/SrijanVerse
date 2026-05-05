import { Pause, Play, SkipForward } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'

export default function MiniPlayer() {
  const navigate = useNavigate()
  const { currentSong, isPlaying, setIsPlaying, handleNext } = usePlayer()

  if (!currentSong || currentSong.id === 'fallback') {
    return null
  }

  return (
    <div
      className="fixed bottom-16 left-0 right-0 z-30 border-t border-white/10 bg-brand-surface/90 backdrop-blur-xl md:bottom-0 md:w-full md:border-t"
      role="button"
      tabIndex={0}
      onClick={() => navigate('/player')}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigate('/player')
        }
      }}
    >
      <div className="w-full px-4 py-3 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
          {/* Album Art Placeholder */}
          <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
            {currentSong.title.charAt(0)}
          </div>

          {/* Song Info */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-white truncate">{currentSong.title}</p>
            <p className="text-xs text-brand-muted truncate">{currentSong.artist}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsPlaying(!isPlaying)
              }}
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext?.()
              }}
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <SkipForward size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
