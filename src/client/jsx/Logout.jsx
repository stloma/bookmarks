/* globals fetch */

import React from 'react'

export const Logout = () => {
  const logout = (event) => {
    event.preventDefault()
    window.location.replace('/login')
    let fetchData = {
      method: 'GET',
      credentials: 'include'
    }
    fetch('/api/logout', fetchData)
      .then(res => {
        if (res.status === 401) {
          console.log('401')
        } else if (res.status !== 200) {
          console.log('Error: ' + res.status)
        } else {
          console.log('logged out')
        }
      })
      .catch(error => console.log('logout failure: ' + error))
  }

  return (
    <div onClick={logout}>Logout</div>
  )
}
