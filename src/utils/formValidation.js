import commonPasswords from '../commonPasswords.json'

export async function usernameExists(username) {
	const response = await fetch(`https://bytebank-db.vercel.app/usernames/${username}`)
	const data = await response.json()
	if (response.status !== 200) return
	return data.usernameExists
}

export function isStringEntirelyNumeric(string) {
	const isEntirelyNumeric = [...string].every((char) => '123456789'.includes(char))
	return isEntirelyNumeric
}

export function isCommonPassword(password) {
	return commonPasswords.includes(password)
}

export function isValidUrl(string) {
	try {
		new URL(string)
		return true
	} catch (error) {
		return false
	}
}

export async function databaseNameExists(name) {
	const response = await fetch(`https://bytebank-db.vercel.app/databases/${name}`)
	const data = await response.json()
	if (response.status !== 200) return
	return data.databaseNameExists
}
