import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AuthContext, { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<BrowserRouter>
		<AuthProvider>
			<App />
		</AuthProvider>
	</BrowserRouter>
)
