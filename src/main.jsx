import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode intentionally omitted: its dev-only double-mount causes
// cascading auth-lock timeouts in @supabase/gotrue-js (the INITIAL_SESSION
// callback holds `lock:sb-*-auth-token` long enough that the next mount's
// subscription can't acquire it within 5s, leaving `loading` pinned true).
createRoot(document.getElementById('root')).render(<App />)
