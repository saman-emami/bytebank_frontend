import React, { useContext, useState } from 'react'
import { Formik, Form, FieldArray } from 'formik'
import FormTextInput from './FormTextInput'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { databaseNameExists, isValidUrl } from '../utils/formValidation'
import icons from '../styles/icons'

function NewDatabase() {
	const { tokens } = useContext(AuthContext)
	const navigate = useNavigate()
	const [isLoading, setIsloading] = useState(false)

	async function validate(values) {
		const errors = {}
		if (!values.name) {
			errors.name = 'Required'
		} /*  else if (await databaseNameExists(values.name)) {
			errors.name = 'Database name is already taken'
		} */

		for (const [index, url] of values.allowed_origins.entries()) {
			if (!errors.hasOwnProperty('allowed_origins')) {
				errors.allowed_origins = []
			}

			if (!url) {
				errors.allowed_origins[index] = 'Required'
			} else if (!isValidUrl(url)) {
				errors.allowed_origins[index] = 'Invalid URL'
			}

			if (JSON.stringify(errors.allowed_origins) === '[]') {
				delete errors.allowed_origins
			}
		}
		return errors
	}

	async function submitNewDatabaseForm(values, { setSubmitting, setErrors }) {
		setIsloading(true)
		if (await databaseNameExists(values.name)) {
			setErrors({ name: 'Database name is already taken' })
		} else {
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${tokens.access}`,
				},
				body: JSON.stringify({ ...values }),
			}
			const response = await fetch(
				'https://bytebank-db.vercel.app/databases/',
				options
			)
			const data = await response.json()

			if (response.status === 200) {
				navigate(`/dashboard/${values.name}`)
			}
			setSubmitting(false)
		}
		setIsloading(false)
	}

	return (
		<div className='form-container'>
			<Formik
				initialValues={{
					name: '',
					allowed_origins: [],
				}}
				validate={validate}
				onSubmit={submitNewDatabaseForm}
			>
				{({ values }) => (
					<Form className='new-database-form form'>
						<h1 className='form-title'>Create new database</h1>
						<FormTextInput
							label='Database name:'
							id='name'
							name='name'
							type='text'
							autoComplete='on'
						/>
						<div className='allowed-origins'>
							<FieldArray name='allowed_origins'>
								{({ remove, push }) => (
									<>
										<h2 id='allowed-origins-title'>Allowed origins</h2>
										{values.allowed_origins.length === 0 && (
											<p>
												If you dont provide any URLs, all origins will be
												allowed.
											</p>
										)}
										{values.allowed_origins.map((allowed_origin, index) => (
											<div className='origin-url' key={index}>
												<div className='url-input-container'>
													<FormTextInput
														label={`${index}.`}
														id={`allowed_origins.${index}`}
														name={`allowed_origins.${index}`}
														type='url'
													/>
												</div>
												<button
													className='delete-url'
													onClick={() => remove(index)}
													type='button'
												>
													{icons.delete}
												</button>
											</div>
										))}
										<div className='form-button-container'>
											<button
												type='button'
												onClick={() => push('')}
												id='add-url-button'
											>
												Add URL
											</button>
										</div>
									</>
								)}
							</FieldArray>
						</div>
						<div className='form-button-container'>
							<button type='submit'>
								Create Database {isLoading && <div className='loader'></div>}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default NewDatabase
