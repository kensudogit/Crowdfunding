import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { setApiBaseUrl } from './services/api'
import './index.css'

;(async () => {
  // 本番で config.json から API URL を読み込み（Railway の API_URL で再ビルド不要）
  try {
    const r = await fetch('/config.json', { cache: 'no-store' })
    if (r.ok) {
      const c = await r.json()
      if (c?.apiUrl && typeof c.apiUrl === 'string') {
        setApiBaseUrl(c.apiUrl)
      }
    }
  } catch {
    // ローカルや config なしの場合はビルド時の URL のまま
  }
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})()
