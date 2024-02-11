import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

const AuthContext = createContext()

export function AuthProvider({ children }) {
	function initializeTokens() {
		const tokenStorage = JSON.parse(localStorage.getItem('tokens'))
		if (tokenStorage) {
			refreshTokens(tokenStorage.refresh)
			return tokenStorage
		} else return null
	}

	const [tokens, setTokens] = useState(initializeTokens)
	const navigate = useNavigate()

	async function refreshTokens(refreshToken) {
		const abortController = new AbortController()

		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh: refreshToken }),
			signal: abortController.signal,
		}

		try {
			const response = await fetch('https://bytebank-db.vercel.app/refresh/', options)
			const data = await response.json()
			if (response.status === 200) {
				setTokens(data)
				localStorage.setItem('tokens', JSON.stringify(data))
			} else if (response.status === 401) {
				logout()
			}
		} catch {}
	}

	function logout() {
		setTokens(null)
		localStorage.removeItem('tokens')
	}

	useEffect(() => {
		if (tokens) {
			const interval = setInterval(() => {
				refreshTokens(tokens.refresh)
			}, 4 * 60 * 1000)
			return () => clearInterval(interval)
		}
	}, [tokens])

	const contextData = {
		setTokens: setTokens,
		tokens: tokens,
		logout: logout,
		username: tokens ? jwtDecode(tokens.access).username : null,
	}

	return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
}

export default AuthContext
