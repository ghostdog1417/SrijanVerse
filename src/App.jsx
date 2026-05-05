import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { PlayerProvider, usePlayer } from './context/PlayerContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Library from './pages/Library'
import Diary from './pages/Diary'
import Poetry from './pages/Poetry'
import FullPlayer from './pages/FullPlayer'
import Player from './components/Player'

// Inner component that uses PlayerContext
function AppContent() {
  const { theme } = usePlayer()

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light')
  }, [theme])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<Library />} />
            <Route path="/poetry" element={<Poetry />} />
            <Route path="/diary" element={<Diary />} />
          </Route>
          <Route path="/player" element={<FullPlayer />} />
        </Routes>
      </BrowserRouter>

      {/* Global Player Component (for audio playback) */}
      <GlobalPlayer />
    </>
  )
}

// Separate component for the global player audio
function GlobalPlayer() {
  const {
    currentSong,
    isPlaying,
    handleNext,
    handlePrevious,
    volume,
    isMuted,
  } = usePlayer()

  if (!currentSong || currentSong.id === 'fallback') {
    return null
  }

  // Use the Player component's audio handling
  // Render it off-screen for audio playback
  return (
    <div className="hidden">
      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={() => {}}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkipNext={handleNext}
        onSkipPrevious={handlePrevious}
        isShuffle={false}
        onToggleShuffle={() => {}}
        repeatMode="all"
        onCycleRepeat={() => {}}
        volume={volume}
        onVolumeChange={() => {}}
        isMuted={isMuted}
        onToggleMute={() => {}}
      />
    </div>
  )
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  )
}
