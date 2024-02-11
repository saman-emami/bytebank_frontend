import React, { useContext } from 'react'
import icons from '../styles/icons'
import { useLocation, Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function Header({ isSidebarOPen, setIsSidebarOPen }) {
	const { pathname } = useLocation()
	const { tokens, logout } = useContext(AuthContext)
	return (
		<header id='header'>
			{pathname.includes('/dashboard') &&
				pathname !== '/dashboard' &&
				pathname !== '/dashboard/' && (
					<button
						className='menu-button'
						onClick={() => setIsSidebarOPen((prev) => !prev)}
					>
						{icons.menu}
					</button>
				)}
			<Link id='website-name' to={`/`}>
				<h1>ByteBank</h1>
			</Link>

			<nav id='auth-buttons-container'>
				{tokens ? (
					<>
						<button id='logout-button' onClick={logout}>
							Logout
						</button>
						{!pathname.includes('/dashboard') && (
							<Link id='dashboard-button' to={`/dashboard`}>
								Dashboard
							</Link>
						)}
					</>
				) : (
					<>
						<Link id='login-button' to={`/login`}>
							Login
						</Link>
						<Link id='signup-button' to={`/signup`}>
							Signup
						</Link>
					</>
				)}
			</nav>
		</header>
	)
}

export default Header
