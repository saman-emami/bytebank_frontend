import React, { useEffect } from 'react'
import { useState } from 'react'

function Table({ table, fetchDatabases, database, tableName }) {
	function initializeDatabasePostInput() {
		const emptyTableInstance = {}
		table.fields.forEach((field) => (emptyTableInstance[field.name] = ''))
		return JSON.stringify(emptyTableInstance, null, 4)
	}

	const [databasePostInput, setDatabasePostInput] = useState(initializeDatabasePostInput)
	const [databasePostResponse, setDatabasePostResponse] = useState('')
	const [isLoading, setIsloading] = useState(false)

	const tableHeader = table.fields.map((field) => field.name)
	const tableBody = table.table_instances.map((instance) =>
		tableHeader.map((header) => `${JSON.stringify(instance[header])}`)
	)
	const tableHeaderElements = tableHeader.map((header, index) => (
		<td key={index}>{header}</td>
	))
	const tableBodyElements = tableBody.map((instance, index) => (
		<tr key={index}>
			{instance.map((field, index) => (
				<td key={index}>{field}</td>
			))}
		</tr>
	))

	useEffect(() => {
		setDatabasePostInput(initializeDatabasePostInput)
	}, [table])

	function handleDatabasePostInputChange(event) {
		setDatabasePostInput(event.target.value)
	}

	async function postTableInstance() {
		setIsloading(true)
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: databasePostInput,
		}
		try {
			const response = await fetch(
				`https://bytebank-db.vercel.app/${database.name}/${table.name}/`,
				options
			)
			const data = await response.json()

			const responseElement = (
				<div className='post-response'>
					<p>STATUS: {response.status}</p>
					<pre>{JSON.stringify(data, null, 4)}</pre>
				</div>
			)

			setDatabasePostResponse(responseElement)
		} catch {}
		fetchDatabases()
		setIsloading(false)
	}

	return (
		<>
			<h2 className='main-title'>{table.name}</h2>
			<div className='table-container'>
				<table className='database-table'>
					<thead className='table-headers'>
						<tr>{tableHeaderElements}</tr>
					</thead>
					<tbody className='table-body'>{tableBodyElements}</tbody>
				</table>
			</div>
			<div className='post-box'>
				<textarea
					value={databasePostInput}
					onChange={handleDatabasePostInputChange}
					rows='10'
					className='post-input'
				></textarea>
				{databasePostResponse}
			</div>
			<button className='post-button' onClick={postTableInstance}>
				POST{isLoading && <div className='loader'></div>}
			</button>
			<h2 className='main-title'>API</h2>
			<div id='api-section'>
				<div className='api-section-div'>
					To query all the rows or add a new row in this table send a{' '}
					<span className='inline-code'>GET</span> or{' '}
					<span className='inline-code'>POST</span> request to the link below
					respectively.
					<span className='api-section-link'>
						{`https://bytebank-db.vercel.app/${database.name}/${table.name}/`}
					</span>
				</div>
				<p>Filter expressions can be added to this URL to filter rows.</p>
				<div className='api-section-div'>
					A filter expression consists of three parts:
					<br />
					<span className='api-section-link'>
						&#60;field_name&#62;&#60;field_lookup&#62;=&#60;value&#62;
					</span>
					<ul>
						<li>Field name (e.g. author, firstname, age...) </li>
						<li>
							A lookup (e.g. --contains) that, if omitted, defaults to --exact.
						</li>
						<li>The value</li>
					</ul>
					for example:
					<span className='api-section-link'>
						{`https://bytebank-db.vercel.app/${database.name}/${table.name}/firstname--endswith=a/`}
					</span>
				</div>
				<div className='api-section-div'>
					<p>A list of all the supported field lookups can be seen below.</p>
					<ul className='lookup-list'>
						<li>
							<span className='inline-code'>contains</span>: Contains the phrase
						</li>
						<li>
							<span className='inline-code'>endswith</span>: Ends with
						</li>
						<li>
							<span className='inline-code'>startswith</span>: Starts with
						</li>
						<li>
							<span className='inline-code'>exact</span>: An exact match
						</li>
						<li>
							<span className='inline-code'>gt</span>: Greater than
						</li>
						<li>
							<span className='inline-code'>gte</span>: Greater than, or equal to
						</li>
						<li>
							<span className='inline-code'>lt</span>: Less than
						</li>
						<li>
							<span className='inline-code'>lte</span>: Less than, or equal to
						</li>
					</ul>
				</div>
				<div className='api-section-div'>
					Many filters can be applied using an "&" sign to separate them.
					<span className='api-section-link'>
						{`https://bytebank-db.vercel.app/${database.name}/${table.name}/firstname--endswith=a/firstname--endswith=a&firstname--contains=bias/`}
					</span>
					If filters are added <span className='inline-code'>PUT</span> and{' '}
					<span className='inline-code'>DELETE</span> requests can be used to update
					or delete a row respectively.
				</div>
			</div>
		</>
	)
}

export default Table
