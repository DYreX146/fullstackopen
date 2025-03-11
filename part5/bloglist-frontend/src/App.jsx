import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('userLogin')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'userLogin', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setNotificationMessage({
        message: 'Wrong username or password',
        isError: true
      })
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('userLogin')
    setUser(null)
  }

  const createBlog = async newBlog => {
    blogFormRef.current.toggleVisibility()

    try {
      const createdBlog = await blogService.create(newBlog)
      createdBlog.user = user

      setBlogs(blogs.concat(createdBlog))
      setNotificationMessage({
        message: `Added ${createdBlog.title} by ${createdBlog.author}`,
        isError: false
      })
      setTimeout(() => setNotificationMessage(null), 5000)
    } catch (error) {
      setNotificationMessage({
        message: error.response.data.error,
        isError: true
      })
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  const updateBlog = async newBlog => {
    try {
      await blogService.update(newBlog.id, newBlog)

      setBlogs(blogs.map(blog => blog.id === newBlog.id ? newBlog : blog))
      setNotificationMessage({
        message: `Updated ${newBlog.title} by ${newBlog.author}`,
        isError: false
      })
      setTimeout(() => setNotificationMessage(null), 5000)
    } catch (error) {
      setNotificationMessage({
        message: error.response.data.error,
        isError: true
      })
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  const deleteBlog = async blog => {
    if (confirm(`Are you sure you want to delete ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)

        setBlogs(blogs.filter(b => b.id !== blog.id))
        setNotificationMessage({
          message: `Deleted ${blog.title} by ${blog.author}`,
          isError: false
        })
        setTimeout(() => setNotificationMessage(null), 5000)
      } catch (error) {
        setNotificationMessage({
          message: error.response.data.error,
          isError: true
        })
        setTimeout(() => setNotificationMessage(null), 5000)
      }
    }
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification notificationMessage={notificationMessage} />

      {user === null ?
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
        :
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>

          <Toggleable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={createBlog}/>
          </Toggleable>

          {blogs.toSorted((blog1, blog2) => blog2.likes - blog1.likes).map(blog =>
            <Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog} />
          )}
        </div>
      }
    </div>
  )
}

export default App