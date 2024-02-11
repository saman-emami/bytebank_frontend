import React from 'react'
import '../styles/landing-page.css'
import dashboardImage from '../images/dashboard.png'
import apiImage from '../images/api.png'
import { Link } from 'react-router-dom'

function Home() {
	return (
		<main id='landing-page'>
			<section id='first-section'>
				<div className='half-section'>
					<h1 className='section-title'>Database in a Flash</h1>
					<p className='landing-paragraph'>
						Deploy a fully functional database in seconds. No coding is required.
					</p>
					<Link className='landing-button' to={`/dashboard`}>
						Start now
					</Link>
				</div>
				<div className='half-section'>
					<img
						className='landing-image'
						src={dashboardImage}
						alt='Bytebank dashboard'
					/>
				</div>
			</section>
			<section id='second-section'>
				<div className='half-section'>
					<img className='landing-image' src={apiImage} alt='Bytebank api' />
				</div>
				<div className='half-section'>
					<h1 className='section-title'>Effortless API access</h1>
					<p className='landing-paragraph'>
						Expose automatic APIs for CRUD operations on your data.
					</p>
				</div>
			</section>
			<section id='third-section'>
				<h1 className='section-title'>In doubt?</h1>
				<p className='landing-paragraph'>Try it yourself. ByteBank is free to use.</p>
				<Link className='landing-button' to={`/signup`}>
					Signup
				</Link>
			</section>
		</main>
	)
}

export default Home
