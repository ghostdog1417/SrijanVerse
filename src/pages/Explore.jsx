import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SongCardLarge } from '../components/Cards'
import { usePlayer } from '../context/PlayerContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function Explore() {
  const {
    songs,
    currentSong,
    isPlaying,
    setIsPlaying,
    likedSongIds,
    toggleLikeSong,
    inferSongMood,
    playQueue,
    setPlayQueue,
    setCurrentSongIndex,
    setQueuePosition,
    markSongAsRecentlyPlayed,
  } = usePlayer()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedView, setSelectedView] = useState('moods')

  const songEntries = useMemo(() => songs.map((song, index) => ({ song, index })), [songs])

  const moodPlaylists = useMemo(() => {
    return songEntries.reduce((acc, entry) => {
      const mood = inferSongMood(entry.song)
      if (!acc[mood]) {
        acc[mood] = []
      }
      acc[mood].push(entry)
      return acc
    }, {})
  }, [songEntries, inferSongMood])

  const artistList = useMemo(() => {
    const catalog = {}
    songEntries.forEach((entry) => {
      const artistName = entry.song.artist?.trim() || 'Unknown Artist'
      if (!catalog[artistName]) {
        catalog[artistName] = []
      }
      catalog[artistName].push(entry)
    })

    return Object.entries(catalog)
      .map(([name, entries]) => ({
        name,
        count: entries.length,
        songs: entries,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [songEntries])

  const albumList = useMemo(() => {
    const catalog = {}
    songEntries.forEach((entry) => {
      const albumName = entry.song.album?.trim() || 'Singles / No Album'
      if (!catalog[albumName]) {
        catalog[albumName] = []
      }
      catalog[albumName].push(entry)
    })

    return Object.entries(catalog)
      .map(([name, entries]) => ({
        name,
        count: entries.length,
        artist: entries[0]?.song.artist || 'Unknown Artist',
        songs: entries,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [songEntries])

  const handlePlaySong = (index) => {
    const currentVisibleQueue = songs.map((_, i) => i)
    setPlayQueue(currentVisibleQueue)
    const nextPosition = Math.max(currentVisibleQueue.indexOf(index), 0)
    setQueuePosition(nextPosition)
    setCurrentSongIndex(index)
    setIsPlaying(true)
    markSongAsRecentlyPlayed(index)
  }

  const filteredItems =
    selectedView === 'moods'
      ? Object.entries(moodPlaylists)
      : selectedView === 'artists'
        ? artistList.filter(
            (artist) =>
              !searchQuery || artist.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : albumList.filter(
            (album) =>
              !searchQuery ||
              album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              album.artist.toLowerCase().includes(searchQuery.toLowerCase()),
          )

  return (
    <motion.div
      className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8 pb-20 md:pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white md:text-4xl">Explore</h1>
        <p className="mt-1 text-sm text-brand-muted">Discover moods, artists, and albums</p>
      </motion.div>

      {/* View Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2">
        {['moods', 'artists', 'albums'].map((view) => (
          <button
            key={view}
            onClick={() => {
              setSelectedView(view)
              setSearchQuery('')
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedView === view
                ? 'bg-brand-accent text-white'
                : 'border border-white/20 text-brand-muted hover:border-white/40 hover:text-white'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Search Bar */}
      {selectedView !== 'moods' && (
        <motion.div variants={itemVariants} className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder={`Search ${selectedView}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-brand-muted transition-colors focus:border-white/30 focus:outline-none"
          />
        </motion.div>
      )}

      {/* Content Grid */}
      <motion.div variants={itemVariants}>
        {selectedView === 'moods' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(moodPlaylists).map(([mood, entries]) => (
              <div
                key={mood}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="mb-4 h-32 w-full rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {mood.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-white">{mood}</h3>
                <p className="text-xs text-brand-muted">{entries.length} tracks</p>
              </div>
            ))}
          </div>
        ) : selectedView === 'artists' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((artist) => (
              <div
                key={artist.name}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="mb-4 h-32 w-full rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {artist.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-white truncate">{artist.name}</h3>
                <p className="text-xs text-brand-muted">{artist.count} songs</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((album) => (
              <div
                key={album.name}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="mb-4 h-32 w-full rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {album.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-white truncate">{album.name}</h3>
                <p className="text-xs text-brand-muted">{album.artist}</p>
                <p className="mt-1 text-xs text-brand-muted">{album.count} songs</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {filteredItems.length === 0 && (
        <motion.div variants={itemVariants} className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-sm text-brand-muted">No {selectedView} found matching your search</p>
        </motion.div>
      )}
    </motion.div>
  )
}
