import { createRoot } from 'react-dom/client'
import App from './App'

const root = document.createElement('div')
root.id = 'react-root'
document.body.replaceChildren(root)

createRoot(root).render(<App />)