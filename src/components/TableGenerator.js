import React, { useContext, useReducer, useState } from 'react'
import TableGeneratorField from './TableGeneratorField'
import AuthContext from '../context/AuthContext'
import icons from '../styles/icons'
import { useNavigate } from 'react-router-dom'

function TableGenerator({
	setDatabases,
	databaseId,
	databaseTablesNames,
	selectedDatabase,
}) {
	const initialTable = {
		name: '',
		fields: [
			{
				name: '',
				blank: false,
				unique: false,
				has_default: false,
				default_text_field: '',
				default_character_field: '',
				default_integer_field: '',
				default_boolean_field: false,
				default_JSON_field: '',
				type: 'char',
			},
		],
		database: databaseId,
	}

	function reducer(
		state,
		{ type, fieldIndex, fieldName, fieldValue, tableNameValue } = {}
	) {
		switch (type) {
			case 'update-text-field':
				return {
					...state,
					fields: state.fields.map((field, index) =>
						index === fieldIndex ? { ...field, [fieldName]: fieldValue } : field
					),
				}

			case 'update-checkbox-field':
				return {
					...state,
					fields: state.fields.map((field, index) =>
						index === fieldIndex
							? { ...field, [fieldName]: !field[fieldName] }
							: field
					),
				}

			case 'add-new-field':
				return {
					...state,
					fields: [
						...state.fields,
						{
							name: '',
							blank: false,
							unique: false,
							has_default: false,
							default_text_field: '',
							default_character_field: '',
							default_integer_field: '',
							default_boolean_field: false,
							default_JSON_field: '',
							type: 'char',
						},
					],
				}

			case 'delete-field':
				return {
					...state,
					fields: state.fields.filter((field, index) => index !== fieldIndex),
				}

			case 'update-table-name':
				return { ...state, name: tableNameValue }

			default:
				return state
		}
	}

	const [table, tableDispatch] = useReducer(reducer, initialTable)
	const [hasClickedSubmit, setHasClickedSubmit] = useState(false)
	const [isTableNameInputTouched, setIsTableNameInputTouched] = useState(false)
	const [isLoading, setIsloading] = useState(false)
	const { tokens } = useContext(AuthContext)
	const navigate = useNavigate()

	const defaultField = {
		char: 'default_character_field',
		int: 'default_integer_field',
		bool: 'default_boolean_field',
		text: 'default_text_field',
		json: 'default_JSON_field',
	}

	const validationErrors = {
		name: '',
		fields: table.fields.map(() => ({
			name: '',
			blank: '',
			unique: '',
			has_default: '',
			default_text_field: '',
			default_character_field: '',
			default_integer_field: '',
			default_boolean_field: '',
			default_JSON_field: '',
		})),
		fieldCount: '',
		isValid: function () {
			if (this.name !== '') return false
			const fieldProperties = this.fields.flatMap((field) => Object.values(field))
			for (const fieldProperty of fieldProperties) {
				if (fieldProperty !== '') return false
			}
			return true
		},
	}

	function validate() {
		// Table fields validations
		const fieldNames = table.fields.map((field) => field.name)
		if (table.fields.length === 0) {
			validationErrors.fieldCount = 'Table should have at least one column'
		}
		for (const [index, field] of table.fields.entries()) {
			if (!field.name) {
				validationErrors.fields[index].name = 'Field name cannot be empty'
			} else if (fieldNames.filter((name) => name === field.name).length !== 1) {
				validationErrors.fields[index].name = 'field names must be unique'
			}

			if (
				field.has_default &&
				field.type !== 'bool' &&
				field[defaultField[field.type]] === ''
			) {
				validationErrors.fields[index][defaultField[field.type]] =
					'Default field cannot be empty'
			}
			// Default JSON field validation
			if (field.has_default && field.type === 'json') {
				try {
					JSON.parse(field.default_JSON_field)
				} catch {
					validationErrors.fields[index].default_JSON_field = 'Invalid JSON input'
				}
			}
		}

		// Table name validations
		if (!table.name) {
			validationErrors.name = 'Table name cannot be empty'
		} else if (databaseTablesNames.includes(table.name)) {
			validationErrors.name = 'A table with this name already exists'
		}
	}
	validate()

	function handleTableNameChange(event) {
		tableDispatch({ type: 'update-table-name', tableNameValue: event.target.value })
	}

	function handleAddNewField(event) {
		event.preventDefault()
		tableDispatch({ type: 'add-new-field' })
	}

	function addTableNameFieldToTouchedInputs() {
		if (!isTableNameInputTouched) setIsTableNameInputTouched(true)
	}

	const finilizeTable = () => ({
		...table,
		fields: table.fields.map((field) => ({
			name: field.name,
			blank: field.blank,
			unique: field.unique,
			has_default: field.has_default,
			...(field.has_default && {
				[defaultField[field.type]]:
					field.type === 'json'
						? JSON.parse(field[defaultField[field.type]])
						: field[defaultField[field.type]],
			}),
			type: field.type,
		})),
	})

	async function submitTable(event) {
		setIsloading(true)
		event.preventDefault()

		if (!hasClickedSubmit) setHasClickedSubmit(true)
		if (!validationErrors.isValid()) {
			setIsloading(false)
			return
		}

		const table = finilizeTable()

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${tokens.access}`,
			},
			body: JSON.stringify(table),
		}
		try {
			const response = await fetch(
				'https://bytebank-db.vercel.app/blueprints/',
				options
			)
			const data = await response.json()
			if (response.status === 200) {
				setDatabases(data)
				navigate(`/dashboard/${selectedDatabase}/${table.name}`)
			}
		} catch {}
		setIsloading(false)
	}

	const generatorFields = table.fields.map((field, index) => (
		<TableGeneratorField
			hasClickedSubmit={hasClickedSubmit}
			index={index}
			field={field}
			errors={validationErrors.fields[index]}
			table={table}
			key={index}
			TableDispatch={tableDispatch}
		/>
	))

	return (
		<>
			<div>
				<input
					className='table-name'
					type='text'
					name='table-name'
					id='table-name'
					value={table.name}
					placeholder='Table name...'
					onChange={handleTableNameChange}
					onBlur={addTableNameFieldToTouchedInputs}
				/>
				{validationErrors.name && (hasClickedSubmit || isTableNameInputTouched) && (
					<p className='field-error'>* {validationErrors.name}</p>
				)}
			</div>
			{validationErrors.fieldCount && (
				<p className='field-error'>* {validationErrors.fieldCount}</p>
			)}
			<div className='fields-container'>
				{generatorFields}
				<button className='new-column-button' onClick={handleAddNewField}>
					{icons.new} <p>New Column</p>
				</button>
			</div>
			<button className='create-table' onClick={submitTable}>
				Create Table{isLoading && <div className='loader'></div>}
			</button>
		</>
	)
}

export default TableGenerator
