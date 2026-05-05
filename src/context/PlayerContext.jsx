import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import songs from '../data/songs'
import poems from '../data/poems'

const PlayerContext = createContext()

const STORAGE_KEYS = {
  likedSongIds: 'srijanverse.likedSongIds',
  playlists: 'srijanverse.playlists',
  recentlyPlayedIds: 'srijanverse.recentlyPlayedIds',
  theme: 'srijanverse.theme',
  equalizerPreset: 'srijanverse.equalizerPreset',
  autoPlaySimilar: 'srijanverse.autoPlaySimilar',
  songDiary: 'srijanverse.songDiary',
  playStats: 'srijanverse.playStats',
  playEvents: 'srijanverse.playEvents',
  likedAtMap: 'srijanverse.likedAtMap',
  visualizerEnabled: 'srijanverse.visualizerEnabled',
  crossfadeEnabled: 'srijanverse.crossfadeEnabled',
  crossfadeSeconds: 'srijanverse.crossfadeSeconds',
  gaplessEnabled: 'srijanverse.gaplessEnabled',
}

const readStoredJSON = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const readStoredString = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ?? fallback
  } catch {
    return fallback
  }
}

const readStoredBoolean = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) {
      return fallback
    }
    return raw === 'true'
  } catch {
    return fallback
  }
}

const readStoredNumber = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) {
      return fallback
    }
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

const inferSongMood = (song) => {
  const title = (song.title || '').toLowerCase()
  const album = (song.album || '').toLowerCase()
  const artist = (song.artist || '').toLowerCase()
  const text = `${title} ${album} ${artist}`

  if (/night|silence|khamoshi|rain|baarish|moon|slow/.test(text)) {
    return 'Late Night'
  }
  if (/love|heart|romance|you|tum/.test(text)) {
    return 'Romance'
  }
  if (/dream|focus|line|between|calm/.test(text)) {
    return 'Focus'
  }

  return 'Unwind'
}

export function PlayerProvider({ children }) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('all')
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  const [likedSongIds, setLikedSongIds] = useState(() => readStoredJSON(STORAGE_KEYS.likedSongIds, []))
  const [playlists, setPlaylists] = useState(() => readStoredJSON(STORAGE_KEYS.playlists, []))
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState(() => readStoredJSON(STORAGE_KEYS.recentlyPlayedIds, []))
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)

  const [theme, setTheme] = useState(() => readStoredString(STORAGE_KEYS.theme, 'dark'))
  const [equalizerPreset, setEqualizerPreset] = useState(() => readStoredString(STORAGE_KEYS.equalizerPreset, 'flat'))
  const [autoPlaySimilar, setAutoPlaySimilar] = useState(() => readStoredBoolean(STORAGE_KEYS.autoPlaySimilar, false))
  const [songDiary, setSongDiary] = useState(() => readStoredJSON(STORAGE_KEYS.songDiary, {}))
  const [playStats, setPlayStats] = useState(() => readStoredJSON(STORAGE_KEYS.playStats, {}))
  const [playEvents, setPlayEvents] = useState(() => readStoredJSON(STORAGE_KEYS.playEvents, []))
  const [likedAtMap, setLikedAtMap] = useState(() => {
    const stored = readStoredJSON(STORAGE_KEYS.likedAtMap, {})
    if (Object.keys(stored).length > 0) {
      return stored
    }
    const seededLikedSongIds = readStoredJSON(STORAGE_KEYS.likedSongIds, [])
    const now = Date.now()
    return seededLikedSongIds.reduce((acc, songId, index) => {
      acc[songId] = now - index * 1000
      return acc
    }, {})
  })

  const [visualizerEnabled, setVisualizerEnabled] = useState(() => readStoredBoolean(STORAGE_KEYS.visualizerEnabled, true))
  const [crossfadeEnabled, setCrossfadeEnabled] = useState(() => readStoredBoolean(STORAGE_KEYS.crossfadeEnabled, false))
  const [crossfadeSeconds, setCrossfadeSeconds] = useState(() => readStoredNumber(STORAGE_KEYS.crossfadeSeconds, 2.5))
  const [gaplessEnabled, setGaplessEnabled] = useState(() => readStoredBoolean(STORAGE_KEYS.gaplessEnabled, false))
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(0)

  const lastTrackedSongIdRef = useRef(null)
  const allSongIndexes = useMemo(() => songs.map((_, index) => index), [])
  const [playQueue, setPlayQueue] = useState(allSongIndexes)
  const [queuePosition, setQueuePosition] = useState(0)

  const currentSong = useMemo(
    () => {
      const song = songs[currentSongIndex] || {
        id: 'fallback',
        title: 'No Song Available',
        artist: 'SrijanVerse',
        album: '',
        file: '',
        lyricsText: '',
      }
      return song
    },
    [currentSongIndex],
  )

  const markSongAsRecentlyPlayed = useCallback((songIndex) => {
    const song = songs[songIndex]
    if (!song) {
      return
    }
    setRecentlyPlayedIds((prev) => [song.id, ...prev.filter((id) => id !== song.id)].slice(0, 20))
  }, [])

  // Persist state to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.likedSongIds, JSON.stringify(likedSongIds))
    } catch {
      // Ignore quota/private mode write failures
    }
  }, [likedSongIds])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.playlists, JSON.stringify(playlists))
    } catch {
      // Ignore quota/private mode write failures
    }
  }, [playlists])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.recentlyPlayedIds, JSON.stringify(recentlyPlayedIds))
    } catch {
      // Ignore quota/private mode write failures
    }
  }, [recentlyPlayedIds])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, theme)
    } catch {
      // Ignore quota/private mode write failures
    }
  }, [theme])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.equalizerPreset, equalizerPreset)
    } catch {
      // Ignore quota/private mode write failures
    }
  }, [equalizerPreset])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.autoPlaySimilar, String(autoPlaySimilar))
    } catch {
      // Ignore quota/private mode write failures
    }
  }, [autoPlaySimilar])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.songDiary, JSON.stringify(songDiary))
    } catch {
      // Ignore quota/private mode write failures
    }
  }, [songDiary])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.playStats, JSON.stringify(playStats))
    } catch {
      // Ignore quota/private mode write failures
    }
  }, [playStats])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.playEvents, JSON.stringify(playEvents))
    } catch {
      // Ignore quota/private mode write failures
    }
  }, [playEvents])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.likedAtMap, JSON.stringify(likedAtMap))
    } catch {
      // Ignore quota/private mode write failures
    }
  }, [likedAtMap])

  // Sleep timer
  useEffect(() => {
    if (sleepTimerMinutes <= 0) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsPlaying(false)
      setSleepTimerMinutes(0)
    }, sleepTimerMinutes * 60 * 1000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [sleepTimerMinutes])

  const toggleLikeSong = (songId) => {
    setLikedSongIds((prev) => {
      if (prev.includes(songId)) {
        setLikedAtMap((likedPrev) => {
          const next = { ...likedPrev }
          delete next[songId]
          return next
        })
        return prev.filter((id) => id !== songId)
      }

      setLikedAtMap((likedPrev) => ({
        ...likedPrev,
        [songId]: Date.now(),
      }))

      return [...prev, songId]
    })
  }

  const handleNext = useCallback(() => {
    if (!songs.length) {
      return
    }

    if (repeatMode === 'one') {
      setIsPlaying(true)
      return
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length)
      setCurrentSongIndex(randomIndex)
      setIsPlaying(true)
      markSongAsRecentlyPlayed(randomIndex)
      return
    }

    if (queuePosition < playQueue.length - 1) {
      const nextQueuePosition = queuePosition + 1
      setQueuePosition(nextQueuePosition)
      setCurrentSongIndex(playQueue[nextQueuePosition])
      setIsPlaying(true)
      markSongAsRecentlyPlayed(playQueue[nextQueuePosition])
      return
    }

    if (repeatMode === 'all' && playQueue.length) {
      setQueuePosition(0)
      setCurrentSongIndex(playQueue[0])
      setIsPlaying(true)
      markSongAsRecentlyPlayed(playQueue[0])
    }
  }, [isShuffle, repeatMode, songs.length, playQueue, queuePosition, markSongAsRecentlyPlayed])

  const handlePrevious = useCallback(() => {
    if (!songs.length) {
      return
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length)
      setCurrentSongIndex(randomIndex)
      setIsPlaying(true)
      markSongAsRecentlyPlayed(randomIndex)
      return
    }

    if (queuePosition > 0) {
      const previousQueuePosition = queuePosition - 1
      setQueuePosition(previousQueuePosition)
      setCurrentSongIndex(playQueue[previousQueuePosition])
      setIsPlaying(true)
      markSongAsRecentlyPlayed(playQueue[previousQueuePosition])
      return
    }

    if (repeatMode === 'all' && playQueue.length) {
      const lastPosition = playQueue.length - 1
      setQueuePosition(lastPosition)
      setCurrentSongIndex(playQueue[lastPosition])
      setIsPlaying(true)
      markSongAsRecentlyPlayed(playQueue[lastPosition])
    }
  }, [isShuffle, repeatMode, songs.length, playQueue, queuePosition, markSongAsRecentlyPlayed])

  const value = {
    // Player state
    currentSongIndex,
    setCurrentSongIndex,
    currentSong,
    isPlaying,
    setIsPlaying,
    isShuffle,
    setIsShuffle,
    repeatMode,
    setRepeatMode,
    volume,
    setVolume,
    isMuted,
    setIsMuted,

    // Queue
    playQueue,
    setPlayQueue,
    queuePosition,
    setQueuePosition,

    // Liked songs
    likedSongIds,
    toggleLikeSong,

    // Playlists
    playlists,
    setPlaylists,
    selectedPlaylistId,
    setSelectedPlaylistId,

    // Recently played
    recentlyPlayedIds,
    markSongAsRecentlyPlayed,

    // Theme
    theme,
    setTheme,

    // Settings
    equalizerPreset,
    setEqualizerPreset,
    autoPlaySimilar,
    setAutoPlaySimilar,
    sleepTimerMinutes,
    setSleepTimerMinutes,

    // Diary
    songDiary,
    setSongDiary,

    // Stats
    playStats,
    setPlayStats,
    playEvents,
    setPlayEvents,
    likedAtMap,

    // Visualizer
    visualizerEnabled,
    setVisualizerEnabled,

    // Crossfade
    crossfadeEnabled,
    setCrossfadeEnabled,
    crossfadeSeconds,
    setCrossfadeSeconds,

    // Gapless
    gaplessEnabled,
    setGaplessEnabled,

    // Controls
    handleNext,
    handlePrevious,

    // Utilities
    inferSongMood,
    songs,
    poems,
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return context
}
