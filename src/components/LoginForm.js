import React, { useContext, useState } from 'react'
import { Formik, Form } from 'formik'
import FormTextInput from './FormTextInput'
import { usernameExists } from '../utils/formValidation'
import AuthContext from '../context/AuthContext'
import { Navigate, Link } from 'react-router-dom'

function LoginForm() {
	const { setTokens, logout, tokens } = useContext(AuthContext)
	const [isLoading, setIsloading] = useState(false)

	async function validate(values) {
		const errors = {}
		if (!values.username) {
			errors.username = 'Required'
		}

		if (!values.password) {
			errors.password = 'Required'
		}

		return errors
	}

	async function submitLoginForm(values, { setSubmitting, setErrors }) {
		setIsloading(true)
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: values.username,
				password: values.password,
			}),
		}
		const response = await fetch('https://bytebank-db.vercel.app/token/', options)
		const data = await response.json()
		if (response.status === 200) {
			setTokens(data)
			localStorage.setItem('tokens', JSON.stringify(data))
		} else if (response.status === 401) {
			setErrors({ username: 'No active account found with the given credentials' })
		}

		setSubmitting(false)
		setIsloading(false)
	}

	if (tokens) {
		return <Navigate to={'/'} />
	}

	return (
		<div className='form-container'>
			<Formik
				initialValues={{
					username: '',
					password: '',
				}}
				validate={validate}
				onSubmit={submitLoginForm}
			>
				<Form className='form'>
					<h1 className='form-title'>Login</h1>
					<FormTextInput
						label='Username:'
						id='username'
						name='username'
						type='text'
						autoComplete='on'
					/>
					<FormTextInput
						label='Password:'
						id='password'
						name='password'
						type='password'
					/>
					<p className='auth-form-message'>
						Don't have an account yet? <Link to={'/signup'}>Sign up</Link>
					</p>
					<div className='form-button-container'>
						<button type='submit'>
							Login {isLoading && <div className='loader'></div>}
						</button>
					</div>
				</Form>
			</Formik>
		</div>
	)
}

export default LoginForm
