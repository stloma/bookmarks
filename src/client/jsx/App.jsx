import React from 'react'
import { Link } from 'react-router-dom'

function BookmarkTable (props) {
  const bookmarkRows = props.bookmarks.map(bookmark => <BookmarkRow key={bookmark._id} bookmark={bookmark} />)
  return (
    <table className='bordered-table'>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Url</th>
          <th>Created</th>
          <th>Comment</th>
          <th>Tags</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {bookmarkRows}
      </tbody>
    </table>
  )
}

const BookmarkRow = (props) => (
  <tr>
    <td><Link to={`/bookmarks/${props.bookmark._id}`}>{props.bookmark._id.substr(-4)}</Link></td>
    <td>{props.bookmark.name}</td>
    <td>{props.bookmark.url}</td>
    <td>{new Date(props.bookmark.created).toString()}</td>
    <td>{props.bookmark.comment}</td>
    <td>{props.bookmark.tags}</td>
    <td><Link to={`/deletebookmark/${props.bookmark._id}`}>X</Link></td>
  </tr>
)

export default class App extends React.Component {
  constructor () {
    super()
    this.state = { bookmarks: [] }
  }

  componentDidMount () {
    this.loadData()
  }

  componentDidUpdate (prevProps) {
    const oldQuery = prevProps.location.search
    const newQuery = this.props.location.search

    if (oldQuery === newQuery) {
      return
    }
    this.loadData()
  }

  loadData () {
    fetch(`/api/bookmarks`).then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log('Total count of records: ', data._metadata.total_count)
          this.setState({ bookmarks: data.records })
        })
      } else {
        response.json().then(error => {
          console.log('Failed to fetch issues: ' + error.message)
        })
      }
    }).catch(err => {
      console.log('Error in fetching data from server: ', err)
    })
  }

  render () {
    return (
      <div>
        <BookmarkTable bookmarks={this.state.bookmarks} />
      </div>

    )
  }
}
