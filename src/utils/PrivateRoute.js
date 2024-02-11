import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
	const { tokens } = useContext(AuthContext)

	return tokens ? children : <Navigate to={'/login'} replace={true} />
}

export default PrivateRoute
