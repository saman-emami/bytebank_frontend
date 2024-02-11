import { useField } from 'formik'
import React from 'react'

function FormTextInput({ label, ...props }) {
	const [field, meta] = useField(props)

	return (
		<>
			<label htmlFor={props.id || props.name}>{label}</label>
			<input className='text-input' {...props} {...field} />
			{meta.touched && meta.error && <p className='field-error'>* {meta.error}</p>}
		</>
	)
}

export default FormTextInput
