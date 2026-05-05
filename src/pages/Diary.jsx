import { motion } from 'framer-motion'
import { Scroll, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
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

const MOOD_OPTIONS = ['Memory', 'Joy', 'Sorrow', 'Reflection', 'Nostalgia', 'Energy', 'Calm']

export default function Diary() {
  const { songs, currentSong, songDiary, setSongDiary } = usePlayer()

  const [editingSongId, setEditingSongId] = useState(null)
  const [editMood, setEditMood] = useState('Memory')
  const [editNote, setEditNote] = useState('')
  const [showModal, setShowModal] = useState(false)

  const songEntries = useMemo(() => songs.map((song, index) => ({ song, index })), [songs])

  const diaryEntries = useMemo(() => {
    return songEntries
      .filter(({ song }) => songDiary[song.id])
      .map(({ song, index }) => ({
        song,
        index,
        diary: songDiary[song.id],
      }))
      .sort((a, b) => {
        const timeA = new Date(a.diary.updatedAt || 0).getTime()
        const timeB = new Date(b.diary.updatedAt || 0).getTime()
        return timeB - timeA
      })
  }, [songEntries, songDiary])

  const startEdit = (song, entry) => {
    setEditingSongId(song.id)
    setEditMood(entry.mood || 'Memory')
    setEditNote(entry.note || '')
    setShowModal(true)
  }

  const saveEntry = () => {
    if (!editingSongId) return

    if (!editNote.trim()) {
      deletEntry()
      setShowModal(false)
      setEditingSongId(null)
      return
    }

    setSongDiary((prev) => ({
      ...prev,
      [editingSongId]: {
        mood: editMood,
        note: editNote.trim(),
        updatedAt: new Date().toISOString(),
      },
    }))

    setShowModal(false)
    setEditingSongId(null)
    setEditNote('')
    setEditMood('Memory')
  }

  const deletEntry = () => {
    if (!editingSongId) return

    setSongDiary((prev) => {
      const next = { ...prev }
      delete next[editingSongId]
      return next
    })

    setShowModal(false)
    setEditingSongId(null)
  }

  const startNewEntry = (song) => {
    setEditingSongId(song.id)
    setEditMood('Memory')
    setEditNote('')
    setShowModal(true)
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
        <h1 className="text-3xl font-bold text-white md:text-4xl">Diary</h1>
        <p className="mt-1 text-sm text-brand-muted">Memories attached to your music</p>
      </motion.div>

      {/* Diary Entries */}
      <motion.div variants={itemVariants} className="space-y-4">
        {diaryEntries.length > 0 ? (
          diaryEntries.map(({ song, diary }) => (
            <motion.button
              key={song.id}
              onClick={() => startEdit(song, diary)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-start gap-4">
                {/* Album Art */}
                <div className="mt-1 h-16 w-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  {song.title.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-white truncate">{song.title}</h3>
                      <p className="text-xs text-brand-muted truncate">{song.artist}</p>
                    </div>
                    <span className="inline-block flex-shrink-0 rounded-full bg-brand-accent/20 px-2 py-1 text-xs font-medium text-brand-accent">
                      {diary.mood}
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">{diary.note}</p>
                  {diary.updatedAt && (
                    <p className="mt-2 text-xs text-brand-muted/60">
                      {new Date(diary.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.button>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <Scroll className="mx-auto mb-3 text-brand-muted" />
            <p className="text-sm text-brand-muted">No diary entries yet. Write about songs that move you!</p>
          </div>
        )}
      </motion.div>

      {/* Suggested Songs to Add */}
      {diaryEntries.length < 5 && (
        <motion.section variants={itemVariants}>
          <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-widest">Suggest Entries</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {songEntries
              .filter(({ song }) => !songDiary[song.id])
              .slice(0, 4)
              .map(({ song, index }) => (
                <motion.button
                  key={song.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => startNewEntry(song)}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <p className="text-sm font-medium text-white truncate">{song.title}</p>
                  <p className="text-xs text-brand-muted truncate">{song.artist}</p>
                </motion.button>
              ))}
          </div>
        </motion.section>
      )}

      {/* Modal */}
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm md:pb-0 pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-xl rounded-t-2xl md:rounded-2xl border border-white/10 bg-brand-surface/95 backdrop-blur-xl p-6 md:p-8"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false)
                setEditingSongId(null)
              }}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            >
              <X size={18} />
            </button>

            {/* Song Info */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-brand-accent">Diary Entry</p>
              <h2 className="mt-2 text-xl font-bold text-white">{songs.find((s) => s.id === editingSongId)?.title}</h2>
              <p className="text-sm text-brand-muted">{songs.find((s) => s.id === editingSongId)?.artist}</p>
            </div>

            {/* Mood Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-3">How did this song make you feel?</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setEditMood(mood)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      editMood === mood
                        ? 'bg-brand-accent text-white'
                        : 'border border-white/10 text-brand-muted hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-2">Your memory or thoughts</label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="What does this song remind you of?"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-brand-muted transition-colors focus:border-white/30 focus:outline-none"
                rows={5}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={saveEntry}
                className="flex-1 rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent/90"
              >
                Save Entry
              </button>
              {editingSongId && songDiary[editingSongId] && (
                <button
                  onClick={deletEntry}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
