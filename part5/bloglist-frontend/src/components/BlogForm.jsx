import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState(null)

  const addBlog = event => {
    event.preventDefault()

    createBlog(newBlog)
    setNewBlog(null)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={newBlog ? newBlog.title ?? '' : ''}
            name="Title"
            onChange={event => setNewBlog({ ...newBlog, title: event.target.value })}
            placeholder='title'
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={newBlog ? newBlog.author ?? '' : ''}
            name="Author"
            onChange={event => setNewBlog({ ...newBlog, author: event.target.value })}
            placeholder='author'
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={newBlog ? newBlog.url ?? '' : ''}
            name="URL"
            onChange={event => setNewBlog({ ...newBlog, url: event.target.value })}
            placeholder='url'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm