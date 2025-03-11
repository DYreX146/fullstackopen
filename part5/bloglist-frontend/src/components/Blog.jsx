import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [displayDetails, setDisplayDetails] = useState(false)

  const handleLike = () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    updateBlog(newBlog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blog'>
      {!displayDetails ?
        <div>
          {blog.title} {blog.author} <button onClick={() => setDisplayDetails(true)}>view</button>
        </div>
        :
        <div>
          <div>
            {blog.title} {blog.author} <button onClick={() => setDisplayDetails(false)}>hide</button>
          </div>
          <div>
            {blog.url}
          </div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>

          {blog.user.username === user.username &&
            <div>
              <button onClick={() => deleteBlog(blog)}>delete</button>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default Blog