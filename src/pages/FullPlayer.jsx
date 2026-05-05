import { motion } from 'framer-motion'
import { Heart, Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'
import Player from '../components/Player'

export default function FullPlayer() {
  const navigate = useNavigate()
  const {
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
    likedSongIds,
    toggleLikeSong,
    handleNext,
    handlePrevious,
    playQueue,
    queuePosition,
    playStats,
    equalizerPreset,
    setEqualizerPreset,
    sleepTimerMinutes,
    setSleepTimerMinutes,
    visualizerEnabled,
    setVisualizerEnabled,
    crossfadeEnabled,
    setCrossfadeEnabled,
    crossfadeSeconds,
    setCrossfadeSeconds,
    gaplessEnabled,
    setGaplessEnabled,
  } = usePlayer()

  const isCurrentLiked = currentSong && likedSongIds.includes(currentSong.id)

  const handleCycleRepeat = () => {
    const order = ['off', 'all', 'one']
    const nextIndex = (order.indexOf(repeatMode) + 1) % order.length
    setRepeatMode(order[nextIndex])
  }

  const queuePreview = playQueue.slice(queuePosition + 1, queuePosition + 6)
  const handleClosePlayer = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-brand-bg md:bg-black/70 md:p-6 md:backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex h-full w-full flex-col overflow-hidden md:mx-auto md:h-[min(92vh,960px)] md:max-w-6xl md:rounded-3xl md:border md:border-white/10 md:bg-brand-bg md:shadow-2xl">
        {/* Header */}
        <div className="border-b border-white/10 bg-brand-surface/50 px-4 py-4 backdrop-blur-xl md:px-6">
          <button
            onClick={() => navigate(-1)}
            className="text-lg font-semibold text-white"
          >
            ← Back
          </button>
        </div>

        {/* Player Component */}
        <div className="flex-1 overflow-y-auto">
          <Player
            currentSong={currentSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkipNext={handleNext}
            onSkipPrevious={handlePrevious}
            isShuffle={isShuffle}
            onToggleShuffle={() => setIsShuffle(!isShuffle)}
            repeatMode={repeatMode}
            onCycleRepeat={handleCycleRepeat}
            volume={volume}
            onVolumeChange={setVolume}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            queuePreview={queuePreview}
            isCurrentLiked={isCurrentLiked}
            onToggleCurrentLike={() => toggleLikeSong(currentSong.id)}
            equalizerPreset={equalizerPreset}
            onEqualizerPresetChange={setEqualizerPreset}
            sleepTimerMinutes={sleepTimerMinutes}
            onSleepTimerChange={setSleepTimerMinutes}
            visualizerEnabled={visualizerEnabled}
            onVisualizerEnabledChange={setVisualizerEnabled}
            crossfadeEnabled={crossfadeEnabled}
            onCrossfadeEnabledChange={setCrossfadeEnabled}
            crossfadeSeconds={crossfadeSeconds}
            onCrossfadeSecondsChange={setCrossfadeSeconds}
            gaplessEnabled={gaplessEnabled}
            onGaplessEnabledChange={setGaplessEnabled}
            isPlayerPage={true}
            onClosePlayerPage={handleClosePlayer}
            onOpenPlayerPage={() => {}}
          />
        </div>
      </div>
    </motion.div>
  )
}
