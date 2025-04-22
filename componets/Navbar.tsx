"use client"
import React from 'react'
import Link from 'next/link'
import { myAppHook } from '@/context/AppProvider'

const Navbar = () => {

    const {logout, authToken} = myAppHook()

  return <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
            <Link  className="navbar-brand" href={authToken ? "/dashboard" : "/"}   
            >
                NextApp
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    {
                        authToken ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={logout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                 <li className="nav-item">
                                    <Link className="nav-link" href="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/auth">Login</Link>
                                </li> 
                            </>
                        )
                    }

                  
                   
                </ul>
            </div>
        </div>
    </nav>
  </>
}

export default Navbar