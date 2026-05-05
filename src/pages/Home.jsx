import { motion } from 'framer-motion'
import { Heart, Radio, Share2, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SongCardCompact, SongCardLarge, MoodChip } from '../components/Cards'
import { usePlayer } from '../context/PlayerContext'
import PoetryCard from '../components/PoetryCard'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 5) return '🌙 Late Night'
  if (hour < 12) return '🌅 Good Morning'
  if (hour < 17) return '☀️ Good Afternoon'
  if (hour < 21) return '🌆 Good Evening'
  return '✨ Good Night'
}

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

export default function Home() {
  const { 
    currentSong, 
    isPlaying, 
    setIsPlaying, 
    likedSongIds, 
    toggleLikeSong, 
    songs,
    recentlyPlayedIds,
    playStats,
    likedAtMap,
    inferSongMood,
    poems,
    playQueue,
    setPlayQueue,
    setCurrentSongIndex,
    setQueuePosition,
    markSongAsRecentlyPlayed,
  } = usePlayer()

  const [selectedMood, setSelectedMood] = useState(null)

  const songEntries = useMemo(() => songs.map((song, index) => ({ song, index })), [songs])
  
  const recentSongEntries = useMemo(
    () =>
      recentlyPlayedIds
        .map((songId) => songEntries.find(({ song }) => song.id === songId))
        .filter(Boolean)
        .slice(0, 6),
    [recentlyPlayedIds, songEntries],
  )

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

  const listeningStats = useMemo(() => {
    const recentSongs = recentSongEntries.map((entry) => entry.song)
    const artistMap = recentSongs.reduce((acc, song) => {
      const key = song.artist || 'Unknown Artist'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const topArtist = Object.entries(artistMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    const exploredAlbums = new Set(recentSongs.map((song) => song.album?.trim() || 'Singles / No Album')).size
    const favoritesRate = songs.length > 0 ? Math.round((likedSongIds.length / songs.length) * 100) : 0

    return {
      recentPlays: recentSongs.length,
      topArtist,
      exploredAlbums,
      favoritesRate,
    }
  }, [likedSongIds.length, recentSongEntries, songs.length])

  const handlePlaySong = (index) => {
    const currentVisibleQueue = songs.map((_, i) => i)
    setPlayQueue(currentVisibleQueue)
    const nextPosition = Math.max(currentVisibleQueue.indexOf(index), 0)
    setQueuePosition(nextPosition)
    setCurrentSongIndex(index)
    setIsPlaying(true)
    markSongAsRecentlyPlayed(index)
  }

  const handleAddToQueue = (index) => {
    setPlayQueue((prev) => [...prev, index])
  }

  const filteredSongs = selectedMood
    ? moodPlaylists[selectedMood] || []
    : []

  return (
    <motion.div
      className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8 pb-20 md:pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand-muted md:text-sm">SrijanVerse</p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">{getGreeting()}</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-muted">A universe of songs and poetry, crafted for every moment</p>
        </div>
      </motion.div>

      {/* Currently Playing Hero Card */}
      {currentSong && currentSong.id !== 'fallback' && (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-brand-accent/30 bg-gradient-to-r from-brand-accent/20 to-blue-500/20 p-6 backdrop-blur-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-accent">Now Playing</p>
              <h2 className="mt-2 text-xl font-bold text-white md:text-2xl">{currentSong.title}</h2>
              <p className="mt-1 text-sm text-brand-muted">{currentSong.artist}</p>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent text-white transition-transform hover:scale-110"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Mood Chips */}
      <motion.div variants={itemVariants}>
        <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-widest">Browse by Mood</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {Object.entries(moodPlaylists).map(([mood, entries]) => (
            <MoodChip
              key={mood}
              mood={mood}
              count={entries.length}
              isSelected={selectedMood === mood}
              onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
            />
          ))}
        </div>
      </motion.div>

      {/* Filtered Mood Songs */}
      {selectedMood && filteredSongs.length > 0 && (
        <motion.section variants={itemVariants}>
          <h3 className="mb-3 text-lg font-semibold text-white">{selectedMood} Tracks</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.slice(0, 6).map(({ song, index }) => (
              <SongCardCompact
                key={song.id}
                song={song}
                isActive={currentSong.id === song.id}
                isPlaying={isPlaying && currentSong.id === song.id}
                isLiked={likedSongIds.includes(song.id)}
                onPlay={() => handlePlaySong(index)}
                onToggleLike={() => toggleLikeSong(song.id)}
                onAddToQueue={() => handleAddToQueue(index)}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Recently Played */}
      <motion.section variants={itemVariants}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recently Played</h3>
          <span className="text-xs text-brand-muted">{recentSongEntries.length} songs</span>
        </div>
        {recentSongEntries.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentSongEntries.slice(0, 6).map(({ song, index }) => (
              <SongCardLarge
                key={song.id}
                song={song}
                isActive={currentSong.id === song.id}
                isLiked={likedSongIds.includes(song.id)}
                onPlay={() => handlePlaySong(index)}
                onToggleLike={() => toggleLikeSong(song.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <Radio className="mx-auto mb-2 text-brand-muted" />
            <p className="text-sm text-brand-muted">No history yet. Start playing songs!</p>
          </div>
        )}
      </motion.section>

      {/* Poetry Section */}
      <motion.section variants={itemVariants}>
        <h3 className="mb-3 text-lg font-semibold text-white">Latest Poetry</h3>
        {poems.length > 0 ? (
          <div className="space-y-3">
            {poems.slice(0, 2).map((poem) => (
              <PoetryCard key={poem.id} poem={poem} isActive={false} onSelect={() => {}} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-sm text-brand-muted">No poems yet. Add `.txt` files in `src/poems`.</p>
          </div>
        )}
      </motion.section>

      {/* Listening Stats */}
      <motion.section variants={itemVariants} className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Your Listening Stats</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: Radio, label: 'Recent Plays', value: listeningStats.recentPlays },
            { icon: Zap, label: 'Top Artist', value: listeningStats.topArtist },
            { icon: Radio, label: 'Albums', value: listeningStats.exploredAlbums },
            { icon: Heart, label: 'Favorites', value: `${listeningStats.favoritesRate}%` },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <Icon size={16} className="mb-2 text-brand-accent" />
                <p className="text-xs text-brand-muted">{stat.label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{stat.value}</p>
              </div>
            )
          })}
        </div>
      </motion.section>
    </motion.div>
  )
}
