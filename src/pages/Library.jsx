import { motion } from 'framer-motion'
import { Heart, Music4, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SongCardCompact, PlaylistCard } from '../components/Cards'
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

export default function Library() {
  const {
    songs,
    currentSong,
    isPlaying,
    setIsPlaying,
    likedSongIds,
    toggleLikeSong,
    playlists,
    setPlaylists,
    selectedPlaylistId,
    setSelectedPlaylistId,
    playQueue,
    setPlayQueue,
    setCurrentSongIndex,
    setQueuePosition,
    markSongAsRecentlyPlayed,
  } = usePlayer()

  const [activeTab, setActiveTab] = useState('songs')
  const [searchQuery, setSearchQuery] = useState('')
  const [newPlaylistName, setNewPlaylistName] = useState('')

  const songEntries = useMemo(() => songs.map((song, index) => ({ song, index })), [songs])

  const likedSongs = useMemo(
    () => songEntries.filter(({ song }) => likedSongIds.includes(song.id)),
    [songEntries, likedSongIds],
  )

  const filteredSongs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return songEntries

    return songEntries.filter(({ song }) =>
      `${song.title} ${song.artist} ${song.album || ''}`.toLowerCase().includes(query),
    )
  }, [songEntries, searchQuery])

  const filteredLikedSongs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return likedSongs

    return likedSongs.filter(({ song }) =>
      `${song.title} ${song.artist} ${song.album || ''}`.toLowerCase().includes(query),
    )
  }, [likedSongs, searchQuery])

  const selectedPlaylist = useMemo(
    () => playlists.find((playlist) => playlist.id === selectedPlaylistId) || null,
    [playlists, selectedPlaylistId],
  )

  const selectedPlaylistEntries = useMemo(() => {
    if (!selectedPlaylist) {
      return []
    }

    return selectedPlaylist.songIds
      .map((songId) => songEntries.find(({ song }) => song.id === songId))
      .filter(Boolean)
  }, [selectedPlaylist, songEntries])

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

  const createPlaylist = () => {
    const name = newPlaylistName.trim()
    if (!name) {
      return
    }

    const playlist = {
      id: `playlist-${Date.now()}`,
      name,
      songIds: [],
    }

    setPlaylists((prev) => [playlist, ...prev])
    setSelectedPlaylistId(playlist.id)
    setNewPlaylistName('')
  }

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((playlist) => playlist.id !== playlistId))
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null)
    }
  }

  return (
    <motion.div
      className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8 pb-20 md:pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white md:text-4xl">Library</h1>
        <p className="mt-1 text-sm text-brand-muted">Your music collection</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 border-b border-white/10">
        {['songs', 'liked', 'playlists'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setSearchQuery('')
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-brand-accent text-brand-accent'
                : 'border-transparent text-brand-muted hover:text-white'
            }`}
          >
            {tab === 'liked' && <Heart size={16} className="inline mr-1" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Search Bar */}
      {activeTab !== 'playlists' && (
        <motion.div variants={itemVariants} className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-brand-muted transition-colors focus:border-white/30 focus:outline-none"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div variants={itemVariants}>
        {activeTab === 'songs' && (
          <div className="space-y-2">
            {filteredSongs.length > 0 ? (
              filteredSongs.map(({ song, index }) => (
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
              ))
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                <Music4 className="mx-auto mb-2 text-brand-muted" />
                <p className="text-sm text-brand-muted">No songs found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="space-y-2">
            {filteredLikedSongs.length > 0 ? (
              filteredLikedSongs.map(({ song, index }) => (
                <SongCardCompact
                  key={song.id}
                  song={song}
                  isActive={currentSong.id === song.id}
                  isPlaying={isPlaying && currentSong.id === song.id}
                  isLiked={true}
                  onPlay={() => handlePlaySong(index)}
                  onToggleLike={() => toggleLikeSong(song.id)}
                  onAddToQueue={() => handleAddToQueue(index)}
                />
              ))
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                <Heart className="mx-auto mb-2 text-brand-muted" />
                <p className="text-sm text-brand-muted">No liked songs yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            {/* Create New Playlist */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                placeholder="New playlist name..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-brand-muted transition-colors focus:border-white/30 focus:outline-none"
              />
              <button
                onClick={createPlaylist}
                className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent/90"
              >
                Create
              </button>
            </div>

            {/* Playlists Grid */}
            {playlists.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {playlists.map((playlist) => {
                  const songCount = playlist.songIds.length
                  const isSelected = selectedPlaylistId === playlist.id

                  return (
                    <button
                      key={playlist.id}
                      onClick={() => setSelectedPlaylistId(playlist.id)}
                      className={`relative rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-brand-accent/50 bg-brand-accent/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="mb-3 h-24 w-full rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Music4 size={32} className="text-white/50" />
                      </div>
                      <h3 className="text-sm font-semibold text-white truncate">{playlist.name}</h3>
                      <p className="text-xs text-brand-muted">{songCount} songs</p>

                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePlaylist(playlist.id)
                          }}
                          className="absolute top-2 right-2 rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/30"
                        >
                          Delete
                        </button>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                <Music4 className="mx-auto mb-2 text-brand-muted" />
                <p className="text-sm text-brand-muted">No playlists yet</p>
              </div>
            )}

            {/* Selected Playlist Songs */}
            {selectedPlaylist && (
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-white">{selectedPlaylist.name}</h3>
                <div className="space-y-2">
                  {selectedPlaylistEntries.length > 0 ? (
                    selectedPlaylistEntries.map(({ song, index }) => (
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
                    ))
                  ) : (
                    <p className="text-sm text-brand-muted">No songs in this playlist</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
