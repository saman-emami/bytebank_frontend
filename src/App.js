import { useContext, useState } from 'react'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Dashboard from './pages/Dashboard'
import { Routes, Route } from 'react-router-dom'
import AuthContext from './context/AuthContext'
import PrivateRoute from './utils/PrivateRoute'
import NotFound from './pages/NotFound'
import NewDatabase from './components/NewDatabase'
import Header from './components/Header'
import './styles/style.css'
import './styles/form-style.css'
import './styles/dashboard-style.css'
import Home from './pages/Home'

function App() {
	const [isSidebarOpen, setIsSidebarOPen] = useState(
		window.innerWidth > 750 ? true : false
	)
	return (
		<>
			<Header isSidebarOpen={isSidebarOpen} setIsSidebarOPen={setIsSidebarOPen} />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/signup' element={<SignupForm />} />
				<Route path='/login' element={<LoginForm />} />
				<Route path='/dashboard'>
					<Route
						index
						element={
							<PrivateRoute>
								<Dashboard
									isSidebarOpen={isSidebarOpen}
									setIsSidebarOPen={setIsSidebarOPen}
								/>
							</PrivateRoute>
						}
					/>
					<Route
						path=':databaseName'
						element={
							<PrivateRoute>
								<Dashboard
									isSidebarOpen={isSidebarOpen}
									setIsSidebarOPen={setIsSidebarOPen}
								/>
							</PrivateRoute>
						}
					>
						<Route
							index
							element={
								<PrivateRoute>
									<Dashboard
										isSidebarOpen={isSidebarOpen}
										setIsSidebarOPen={setIsSidebarOPen}
									/>
								</PrivateRoute>
							}
						/>
						<Route
							path=':tableName'
							element={
								<PrivateRoute>
									<Dashboard
										isSidebarOpen={isSidebarOpen}
										setIsSidebarOPen={setIsSidebarOPen}
									/>
								</PrivateRoute>
							}
						/>
					</Route>
				</Route>
				<Route path='/dashboard/new-database' element={<NewDatabase />} />
				<Route path='/not-found' element={<NotFound />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
	)
}

export default App
