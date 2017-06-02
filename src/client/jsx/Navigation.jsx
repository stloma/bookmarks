import React from 'react'
import { Link } from 'react-router-dom'

export const Navigation = (props) => (
  <div className='header'>
    <Link to='/'>Home</Link>
    <Link to='/addbookmark'>Addbookmark</Link>
    <h3>Bookmark Manager</h3>
  </div>
)
