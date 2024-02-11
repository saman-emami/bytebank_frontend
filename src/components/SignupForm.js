import React, { useContext, useState } from 'react'
import { Formik, Form } from 'formik'
import FormTextInput from './FormTextInput'
import {
	usernameExists,
	isStringEntirelyNumeric,
	isCommonPassword,
} from '../utils/formValidation'
import AuthContext from '../context/AuthContext'
import { Link, Navigate } from 'react-router-dom'

function SignupForm() {
	const { setTokens, tokens } = useContext(AuthContext)
	const [isLoading, setIsloading] = useState(false)

	async function validate(values) {
		const errors = {}
		if (!values.username) {
			errors.username = 'Required'
		}

		if (!values.password1) {
			errors.password1 = 'Required'
		} else if (values.password1.length < 8) {
			errors.password1 = 'Password must be at least 8 characters'
		} else if (isStringEntirelyNumeric(values.password1)) {
			errors.password1 = 'Password is entirely numeric'
		} else if (isCommonPassword(values.password1)) {
			errors.password1 = 'Password is too common'
		}

		if (!values.password2) {
			errors.password2 = 'Required'
		} else if (values.password2 !== values.password1) {
			errors.password2 = 'Please make sure your passwords match'
		}
		return errors
	}

	async function submitSignUpForm(values, { setSubmitting, setErrors }) {
		setIsloading(true)
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: values.username,
				password: values.password1,
			}),
		}
		const response = await fetch('https://bytebank-db.vercel.app/register/', options)
		const data = await response.json()

		if (response.status === 200) {
			setTokens(data)
			localStorage.setItem('tokens', JSON.stringify(data))
			console.log(data)
		} else if (response.status === 400 && data.detail === 'user already exists') {
			setErrors({ username: 'Username is already taken' })
		}
		setSubmitting(false)
		setIsloading(false)
	}

	if (tokens) return <Navigate to={'/'} />

	return (
		<div className='form-container'>
			<Formik
				initialValues={{
					username: '',
					password1: '',
					password2: '',
				}}
				validate={validate}
				onSubmit={submitSignUpForm}
			>
				<Form className='form'>
					<h1 className='form-title'>Sign up</h1>
					<FormTextInput
						label='Username:'
						id='username'
						name='username'
						type='text'
						autoComplete='on'
					/>

					<FormTextInput
						label='Password:'
						id='password1'
						name='password1'
						type='password'
					/>

					<FormTextInput
						label='Confirm Password:'
						id='password2'
						name='password2'
						type='password'
					/>

					<p className='auth-form-message'>
						Already have an account? <Link to={'/login'}>Log in</Link>
					</p>

					<div className='form-button-container'>
						<button type='submit'>
							Sign Up {isLoading && <div className='loader'></div>}
						</button>
					</div>
				</Form>
			</Formik>
		</div>
	)
}

export default SignupForm
