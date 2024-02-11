import React, { useState } from 'react'
import icons from '../styles/icons'

function TableGeneratorField({ index, field, TableDispatch, errors, hasClickedSubmit }) {
	const [touchedInputs, setTouchedInputs] = useState([])

	function addInputToTouchedInputs(event) {
		if (touchedInputs.includes(event.target.name)) return
		setTouchedInputs((currentState) => [...currentState, event.target.name])
	}

	function handleTextFieldChange(event) {
		if (event.target.name === 'default_integer_field') {
			const numberInput = event.target.value
			if (numberInput.slice(-2, -1) === '.') {
				return
			}
		}
		TableDispatch({
			type: 'update-text-field',
			fieldName: event.target.name,
			fieldValue: event.target.value,
			fieldIndex: index,
		})
	}

	function handleCheckboxFieldChange(event) {
		TableDispatch({
			type: 'update-checkbox-field',
			fieldName: event.target.name,
			fieldIndex: index,
		})
	}

	function handleDeleteField(event) {
		event.preventDefault()
		TableDispatch({
			type: 'delete-field',
			fieldIndex: index,
		})
	}

	const defaultValueInput = {
		char: (
			<>
				<label htmlFor={`default_character_field_${index}`}>Default:</label>
				<input
					type='text'
					name='default_character_field'
					id={`default_character_field_${index}`}
					onChange={handleTextFieldChange}
					onBlur={addInputToTouchedInputs}
					value={field.default_character_field}
				/>
				{errors.default_character_field &&
					(hasClickedSubmit ||
						touchedInputs.includes('default_character_field')) && (
						<p className='field-error'>* {errors.default_character_field}</p>
					)}
			</>
		),
		int: (
			<>
				<label htmlFor={`default_integer_field_${index}`}>Default:</label>
				<input
					type='number'
					name='default_integer_field'
					id={`default_integer_field_${index}`}
					onChange={handleTextFieldChange}
					onBlur={addInputToTouchedInputs}
					value={field.default_integer_field}
				/>
				{errors.default_integer_field &&
					(hasClickedSubmit || touchedInputs.includes('default_integer_field')) && (
						<p className='field-error'>* {errors.default_integer_field}</p>
					)}
			</>
		),
		bool: (
			<>
				<div>
					<label htmlFor={`default_boolean_field_${index}`}>Default:</label>
					<input
						type='checkbox'
						name='default_boolean_field'
						id={`default_boolean_field_${index}`}
						onChange={handleCheckboxFieldChange}
						onBlur={addInputToTouchedInputs}
						checked={field.default_boolean_field}
					/>
					<span className='default_boolean_field_value'>{`${field.default_boolean_field}`}</span>
				</div>

				{errors.default_boolean_field &&
					(hasClickedSubmit || touchedInputs.includes('default_boolean_field')) && (
						<p>* {errors.default_boolean_field}</p>
					)}
			</>
		),
		json: (
			<>
				<label htmlFor={`default_JSON_field_${index}`}>Default:</label>
				<textarea
					name='default_JSON_field'
					id={`default_JSON_field_${index}`}
					value={field.default_JSON_field}
					onBlur={addInputToTouchedInputs}
					onChange={handleTextFieldChange}
				></textarea>
				{errors.default_JSON_field &&
					(hasClickedSubmit || touchedInputs.includes('default_JSON_field')) && (
						<p className='field-error'>* {errors.default_JSON_field}</p>
					)}
			</>
		),
		text: (
			<>
				<label htmlFor={`default_text_field_${index}`}>Default:</label>
				<textarea
					name='default_text_field'
					id={`default_text_field_${index}`}
					value={field.default_text_field}
					onBlur={addInputToTouchedInputs}
					onChange={handleTextFieldChange}
				></textarea>
				{errors.default_text_field &&
					(hasClickedSubmit || touchedInputs.includes('default_text_field')) && (
						<p className='field-error'>* {errors.default_text_field}</p>
					)}
			</>
		),
	}

	return (
		<div className='form'>
			<label htmlFor={`name_${index}`}>Field name:</label>
			<input
				type='text'
				name='name'
				id={`name_${index}`}
				onChange={handleTextFieldChange}
				onBlur={addInputToTouchedInputs}
				value={field.name}
			/>
			{errors.name && (hasClickedSubmit || touchedInputs.includes('name')) && (
				<p className='field-error'>* {errors.name}</p>
			)}

			<label htmlFor={`type_${index}`}>Data type:</label>
			<select
				name='type'
				id={`type_${index}`}
				value={field.type}
				onChange={handleTextFieldChange}
				onBlur={addInputToTouchedInputs}
			>
				<option value='char'>Character</option>
				<option value='int'>Integer</option>
				<option value='bool'>Boolean</option>
				<option value='text'>Text</option>
				<option value='json'>JSON</option>
			</select>

			<div>
				<label htmlFor={`blank_${index}`}>Allow blank:</label>
				<input
					type='checkbox'
					name='blank'
					id={`blank_${index}`}
					onChange={handleCheckboxFieldChange}
					onBlur={addInputToTouchedInputs}
					checked={field.blank}
				/>
			</div>

			<div>
				<label htmlFor={`unique_${index}`}>Unique:</label>
				<input
					type='checkbox'
					name='unique'
					id={`unique_${index}`}
					onChange={handleCheckboxFieldChange}
					onBlur={addInputToTouchedInputs}
					checked={field.unique}
				/>
			</div>

			<div>
				<label htmlFor={`has_default_${index}`}>Provide a default value?:</label>
				<input
					type='checkbox'
					name='has_default'
					id={`has_default_${index}`}
					onChange={handleCheckboxFieldChange}
					onBlur={addInputToTouchedInputs}
					checked={field.hasDefault}
				/>
			</div>

			{field.has_default && defaultValueInput[field.type]}
			<div className='form-button-container'>
				<button className='delete-field' onClick={handleDeleteField}>
					{icons.delete}
				</button>
			</div>
		</div>
	)
}

export default TableGeneratorField
