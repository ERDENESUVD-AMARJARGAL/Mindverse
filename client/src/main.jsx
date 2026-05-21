import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { API_BASE_URL } from './services/api'
import App from './App.jsx'
import './index.css'
import './assets/css/sidebar.css'
import './assets/css/signup.css'
import './assets/css/student-main.css'
import './assets/css/student-classes.css'
import './assets/css/market.css'
import './assets/css/calendar.css'
import './assets/css/settings.css'
import './assets/css/teacher-main.css'
import './assets/css/teacher-classes.css'
import './assets/css/teacher-students.css'
import './assets/css/teacher-analytics.css'
import './assets/css/teacher-market.css'

window.API_URL = API_BASE_URL

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)
