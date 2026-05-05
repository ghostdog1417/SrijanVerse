import { motion } from 'framer-motion'
import { BookOpen, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import poems from '../data/poems'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export default function Poetry() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPoem, setSelectedPoem] = useState(null)
  const [poemContent, setPoemContent] = useState('')

  const filteredPoems = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return poems

    return poems.filter(
      (poem) =>
        poem.title.toLowerCase().includes(term) ||
        poem.author.toLowerCase().includes(term)
    )
  }, [searchTerm])

  const handleSelectPoem = async (poem) => {
    setSelectedPoem(poem)
    try {
      const response = await fetch(`/src/poems/${poem.filename}`)
      const text = await response.text()
      setPoemContent(text)
    } catch (error) {
      console.error(`Failed to load poem: ${error.message}`)
      setPoemContent('Failed to load poem content.')
    }
  }

  return (
    <motion.div
      className="space-y-8 px-4 py-8 md:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.section variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="text-brand-accent" size={24} />
          <h1 className="text-3xl font-bold md:text-4xl">Poetry</h1>
        </div>
        <p className="text-brand-muted">Immerse yourself in original poetry</p>
      </motion.section>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-3 text-brand-muted" size={18} />
        <input
          type="text"
          placeholder="Search poems or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-brand-muted focus:border-brand-accent focus:bg-white/10 focus:outline-none"
        />
      </motion.div>

      {/* Poems Grid */}
      {!selectedPoem ? (
        <motion.div
          variants={containerVariants}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredPoems.map((poem) => (
            <motion.button
              key={poem.id}
              variants={itemVariants}
              onClick={() => handleSelectPoem(poem)}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-brand-accent/50 hover:bg-white/10"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-white">
                <BookOpen size={20} />
              </div>
              <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-white group-hover:text-brand-accent">
                {poem.title}
              </h3>
              <p className="text-sm text-brand-muted">{poem.author}</p>
            </motion.button>
          ))}
        </motion.div>
      ) : (
        /* Poem Reader */
        <motion.div
          key={`poem-${selectedPoem.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8"
        >
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                {selectedPoem.title}
              </h2>
              <p className="mt-2 text-brand-muted">by {selectedPoem.author}</p>
            </div>
            <button
              onClick={() => {
                setSelectedPoem(null)
                setPoemContent('')
              }}
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close poem"
            >
              <X size={20} />
            </button>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-brand-muted leading-relaxed">
              {poemContent}
            </div>
          </div>
        </motion.div>
      )}

      {filteredPoems.length === 0 && !selectedPoem && (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center"
        >
          <BookOpen className="mx-auto mb-4 text-brand-muted" size={32} />
          <p className="text-brand-muted">No poems found matching "{searchTerm}"</p>
        </motion.div>
      )}
    </motion.div>
  )
}
