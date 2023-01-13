import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Root from './pages/Root'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense fallback={<h2>🌀 Loading...</h2>}>
      <Root />
   </Suspense>,
)


