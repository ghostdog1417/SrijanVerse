# Migration & Troubleshooting Guide

## Quick Start After Refactoring

### 1. Install New Dependencies
```bash
npm install react-router-dom framer-motion
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Test Routes
- `/` - Home page
- `/explore` - Browse moods, artists, albums
- `/library` - Manage songs, playlists, liked songs
- `/diary` - Song diary entries
- `/player` - Full player (mobile only)

---

## Common Issues & Solutions

### Issue: "PlayerContext is not defined"
**Solution**: Ensure `PlayerProvider` wraps your app in `App.jsx`. Check:
```jsx
<PlayerProvider>
  <AppContent />
</PlayerProvider>
```

### Issue: "usePlayer hook returns undefined"
**Solution**: Make sure component is inside `PlayerProvider`. Check app structure:
- ✅ Correct: `App.jsx` → `PlayerProvider` → `AppContent`
- ❌ Wrong: `App.jsx` → `AppContent` (provider missing)

### Issue: Bottom nav not showing on mobile
**Solution**: Check Tailwind breakpoints. Should show on mobile and hide on `md:` screens:
```jsx
// In BottomNav.jsx - should be responsive
className="md:hidden" // hidden on desktop
```

### Issue: Desktop sidebar not showing
**Solution**: Check hidden class. Should hide on mobile, show on desktop:
```jsx
// In DesktopSidebar.jsx
className="hidden md:flex" // hidden on mobile, shown on md and up
```

### Issue: Mini player not updating
**Solution**: Ensure PlayerContext is properly updating. Check:
1. `handleNext` function is called correctly
2. `setIsPlaying` is working
3. Song data exists in PlayerContext

### Issue: Routes not working
**Solution**: Check `BrowserRouter` is in App.jsx:
```jsx
<BrowserRouter>
  <Routes>
    {/* routes here */}
  </Routes>
</BrowserRouter>
```

### Issue: Animations not showing
**Solution**: Ensure Framer Motion is installed:
```bash
npm install framer-motion
```

---

## File Structure Verification

Ensure these files exist:
```
src/
├── App.jsx ✓
├── context/PlayerContext.jsx ✓
├── components/
│   ├── Layout.jsx ✓
│   ├── DesktopSidebar.jsx ✓
│   ├── BottomNav.jsx ✓
│   ├── MiniPlayer.jsx ✓
│   ├── Cards.jsx ✓
│   └── Player.jsx ✓ (existing)
├── pages/
│   ├── Home.jsx ✓
│   ├── Explore.jsx ✓
│   ├── Library.jsx ✓
│   ├── Diary.jsx ✓
│   └── FullPlayer.jsx ✓
└── ...
```

---

## Testing Checklist

### Mobile (Responsive Testing)
- [ ] Bottom nav visible
- [ ] Bottom nav has 4 items: Home, Explore, Library, Diary
- [ ] Mini player shows current song
- [ ] Clicking mini player opens full player modal
- [ ] All pages scroll properly
- [ ] Cards stack in single column

### Desktop
- [ ] Desktop sidebar visible (left side)
- [ ] Bottom nav hidden
- [ ] Sidebar has navigation items
- [ ] Theme toggle button visible in sidebar
- [ ] Cards in 2-3 column grid
- [ ] Layout feels spacious

### Functionality
- [ ] Can navigate between pages
- [ ] Can play songs from Home page
- [ ] Recently played updates
- [ ] Like/unlike songs works
- [ ] Create playlist works
- [ ] Diary entries save
- [ ] Theme toggle switches colors

---

## Performance Tips

1. **Optimize Images**: Album art placeholders are CSS-based (no image loading needed)
2. **Code Splitting**: Consider lazy loading pages with `React.lazy()`:
   ```jsx
   const Home = lazy(() => import('./pages/Home'))
   const Explore = lazy(() => import('./pages/Explore'))
   ```
3. **Memoization**: Pages already use `useMemo` for expensive computations
4. **Context Optimization**: Consider splitting PlayerContext if it becomes too large

---

## Customization Guide

### Change Mobile Breakpoint
In Tailwind config, change `md:` breakpoint:
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'md': '768px', // Change this value
      }
    }
  }
}
```

### Modify Color Scheme
Update CSS custom properties:
```css
/* index.css */
:root {
  --brand-accent: /* new color */;
  --brand-muted: /* new color */;
}
```

### Add New Navigation Item
1. Update `navItems` in `DesktopSidebar.jsx` and `BottomNav.jsx`
2. Add new page in `src/pages/`
3. Add route in `App.jsx`

### Change Animation Timing
Update `containerVariants` and `itemVariants`:
```jsx
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.15, // Change stagger
      delayChildren: 0.3,    // Change delay
    },
  },
}
```

---

## Debugging Tips

### Enable Router Debugging
```jsx
import { useLocation } from 'react-router-dom'

export default function Component() {
  const location = useLocation()
  console.log('Current route:', location.pathname)
}
```

### Monitor Context Changes
```jsx
const { currentSong, isPlaying } = usePlayer()
useEffect(() => {
  console.log('Song changed:', currentSong.title)
  console.log('Playing:', isPlaying)
}, [currentSong, isPlaying])
```

### Check Responsive Breakpoints
Open DevTools and test:
- Width < 768px (mobile)
- Width >= 768px (desktop)

---

## Backward Compatibility

Old components are still available:
- `Sidebar.jsx` - Can be used if needed
- `SongCard.jsx` - Original component preserved
- `PoetryCard.jsx` - Still functional

To revert to old layout, update `App.jsx` routes, but recommended to use new structure.

---

## Need Help?

1. Check console for errors: `F12` → Console
2. Check Network tab for failed requests
3. Check Applied Styles in DevTools
4. Review `REFACTORING_SUMMARY.md` for feature overview
5. Check PlayerContext for available state/methods

---

Last Updated: May 2026
Status: Ready for Production
