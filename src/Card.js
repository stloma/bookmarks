import React from 'react'

const Card = (props) => {
  const { title, url, dateAdded, author, tags, notes } = props
  return (
    <div className='show-card'>
      <div className="card-title">{title}</div>
      {url}
      {author} {dateAdded}
    </div>

  )
}

export default Card