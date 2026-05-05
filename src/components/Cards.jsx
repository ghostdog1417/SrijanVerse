import { Heart, Music4, Pause, Play } from 'lucide-react'

export function SongCardCompact({ song, isActive, isPlaying, isLiked, onPlay, onToggleLike, onAddToQueue }) {
  return (
    <div className={`group rounded-xl border transition-all ${isActive ? 'border-brand-accent/50 bg-brand-accent/5' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}`}>
      <button
        onClick={onPlay}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        {/* Album Art */}
        <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
          {isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} className="ml-0.5" />
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{song.title}</h3>
          <p className="text-xs text-brand-muted truncate">{song.artist}</p>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleLike?.()
          }}
          className="rounded-full bg-white/10 p-2 text-white opacity-0 transition-all group-hover:opacity-100"
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} color={isLiked ? '#ff6b6b' : 'currentColor'} />
        </button>
      </button>
    </div>
  )
}

export function SongCardLarge({ song, isActive, isLiked, onPlay, onToggleLike }) {
  return (
    <button
      onClick={onPlay}
      className={`group rounded-2xl border p-4 transition-all ${isActive ? 'border-brand-accent/50 bg-brand-accent/10' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}`}
    >
      {/* Album Art */}
      <div className="relative mb-4 h-32 w-full rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play size={40} className="ml-2" fill="white" />
        </div>
        {song.title.charAt(0)}
      </div>

      {/* Song Info */}
      <h3 className="text-sm font-semibold text-white truncate">{song.title}</h3>
      <p className="text-xs text-brand-muted truncate">{song.artist}</p>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between pt-3 border-t border-white/10">
        <span className="text-xs text-brand-muted">{song.album || 'Single'}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleLike?.()
          }}
          className="rounded-full bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
        >
          <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} color={isLiked ? '#ff6b6b' : 'currentColor'} />
        </button>
      </div>
    </button>
  )
}

export function MoodChip({ mood, count, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
        isSelected
          ? 'bg-brand-accent text-white'
          : 'border border-white/20 text-brand-muted hover:border-white/40 hover:text-white'
      }`}
    >
      {mood} {count > 0 && <span className="ml-1 text-xs">({count})</span>}
    </button>
  )
}

export function GenericCard({ title, description, icon: Icon, onClick, isClickable = true }) {
  const Component = isClickable ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={`rounded-xl border border-white/10 bg-white/5 p-4 transition-all ${
        isClickable ? 'hover:border-white/20 hover:bg-white/10 cursor-pointer' : ''
      }`}
    >
      {Icon && <Icon size={24} className="text-brand-accent mb-2" />}
      {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
      {description && <p className="mt-1 text-xs text-brand-muted">{description}</p>}
    </Component>
  )
}

export function PlaylistCard({ playlist, songCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-white/20 hover:bg-white/10"
    >
      <div className="mb-3 h-24 w-full rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <Music4 size={32} className="text-white/50" />
      </div>
      <h3 className="text-sm font-semibold text-white truncate">{playlist.name}</h3>
      <p className="text-xs text-brand-muted">{songCount} songs</p>
    </button>
  )
}
