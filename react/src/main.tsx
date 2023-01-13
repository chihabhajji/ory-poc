import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense fallback={<h2>🌀 Loading...</h2>}>
      <App />
   </Suspense>
  ,
)


