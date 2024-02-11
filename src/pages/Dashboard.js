import React from 'react'
import TableGenerator from '../components/TableGenerator'
import AuthContext from '../context/AuthContext'
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import Table from '../components/Table'
import icons from '../styles/icons'

function Dashboard({ isSidebarOpen }) {
	const navigate = useNavigate()
	const { tokens, logout } = useContext(AuthContext)
	const [databases, setDatabases] = useState(null)
	const { tableName, databaseName } = useParams()
	const [selectedDatabase, setSelectedDatabase] = useState(databaseName)

	async function fetchDatabases() {
		const options = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${tokens.access}`,
			},
		}
		const response = await fetch('https://bytebank-db.vercel.app/blueprints/', options)
		const data = await response.json()

		if (response.status === 401) logout()

		if (response.status === 200) {
			console.log(data)
			setDatabases(data)
		}
	}

	useEffect(() => {
		fetchDatabases()
	}, [tokens])

	function handleDatabaseChange(event) {
		if (event.target.value) navigate(`/dashboard/${event.target.value}`)
	}

	useEffect(() => {
		setSelectedDatabase(databaseName)
	}, [databaseName])

	if (!databases)
		return (
			<div className='dashboard-container'>
				<main className='dashboard-main empty full'>
					<div className='loader'></div>
				</main>
			</div>
		)

	const databaseNames = databases.map((database) => database.name)
	if (databaseName && !databaseNames.includes(databaseName)) {
		return <Navigate to={'/not-found'} />
	}

	const databaseOptions = databases.map((database, index) => (
		<option key={index} value={database.name}>
			{database.name}
		</option>
	))

	if (selectedDatabase === undefined) {
		return (
			<div className='dashboard-container'>
				<main className='dashboard-main empty full'>
					{databaseOptions.length === 0 ? (
						<div className='main-message'>
							<h1>Create your first database</h1>
							<p>
								You don't seem to have any databases. Use the button below to
								create your first database.
							</p>
							<Link
								to='/dashboard/new-database'
								className='button-hover message-button'
							>
								Create a new database{icons.newCircle}
							</Link>
						</div>
					) : (
						<div className='main-message'>
							<h1>Select a database</h1>
							<p>Select a database using the dropdown below to see it's tables.</p>
							<div className='database-selector'>
								<select
									value={selectedDatabase}
									onChange={handleDatabaseChange}
									name='databases'
									defaultValue={undefined}
									className='database-select'
								>
									<option value={undefined} hidden>
										Please Choose...
									</option>
									{databaseOptions}
								</select>
								<Link
									className='new-database-button'
									to='/dashboard/new-database'
								>
									{icons.newCircle}
								</Link>
							</div>
						</div>
					)}
				</main>
			</div>
		)
	}

	const database = databases.find((database) => database.name === selectedDatabase)
	const databaseTablesNames = database.tables.map((table) => table.name)

	const tableNames = database.tables.map((table) => table.name)

	if (tableName && tableName !== 'new-table' && !tableNames.includes(tableName)) {
		return <Navigate to={'/not-found'} />
	}

	const sidebarTableButtons = database.tables.map((table, index) => (
		<Link
			className={'sidebar-table-buttons ' + (tableName === table.name ? 'active' : '')}
			to={`/dashboard/${selectedDatabase}/${table.name}`}
			key={index}
		>
			<li>{table.name}</li>
		</Link>
	))

	return (
		<div className='dashboard-container'>
			<aside className={'sidebar ' + (isSidebarOpen ? 'open ' : '')}>
				<div className='database-selector'>
					<select
						value={selectedDatabase}
						onChange={handleDatabaseChange}
						name='databases'
						className='database-select'
					>
						{databaseOptions}
					</select>

					<Link className='new-database-button' to='/dashboard/new-database'>
						{icons.newCircle}
					</Link>
				</div>
				{databaseName && (
					<ul>
						{sidebarTableButtons}

						<Link
							id='new-table-button'
							to={`/dashboard/${selectedDatabase}/new-table`}
							className='button-hover'
						>
							<li>New table{icons.newCircle}</li>
						</Link>
					</ul>
				)}
			</aside>
			<main
				className={
					'dashboard-main ' +
					(!isSidebarOpen ? 'full ' : '') +
					(!tableName ? 'empty ' : '')
				}
			>
				{tableName ? (
					tableName === 'new-table' ? (
						<TableGenerator
							databaseTablesNames={databaseTablesNames}
							setDatabases={setDatabases}
							databaseId={database.id}
							selectedDatabase={selectedDatabase}
						/>
					) : (
						<Table
							database={database}
							tableName={tableName}
							fetchDatabases={fetchDatabases}
							table={database.tables.find((table) => table.name === tableName)}
						/>
					)
				) : tableNames.length === 0 ? (
					<div className='main-message'>
						<h1>Create a table</h1>
						<p>
							{databaseName} has no tables. Use the the sidebar or the button below
							to create a new table.
						</p>
						<Link
							to={`/dashboard/${selectedDatabase}/new-table`}
							className='button-hover message-button'
						>
							New table{icons.newCircle}
						</Link>
					</div>
				) : (
					<div className='main-message'>
						<h1>Select a table</h1>
						<p>Use the sidebar to select a table or create a new one.</p>
					</div>
				)}
			</main>
		</div>
	)
}

export default Dashboard
