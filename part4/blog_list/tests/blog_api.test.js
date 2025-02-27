const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const { blogs, getBlogsFromDb, nonExistingId, getAuthToken } = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('test blog api', () => {
  const username = 'root'
  let id = ''

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username, passwordHash })
    await user.save()

    id = user.id

    blogs.forEach(blog => blog.user = user.id)
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
  })
  
  describe('get all blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
    
      assert.strictEqual(response.body.length, blogs.length)
    })
    
    test('blog has correct id property', async () => {
      const response = await api.get('/api/blogs')
    
      assert(response.body[0].id)
      assert(!response.body[0]._id)
    })
  })
  
  describe('add blog', () => {
    test('can add valid blog', async () => {
      const newBlog = {
        title: '"Clean" Code, Horrible Performance',
        author: 'Casey Muratori',
        url: 'https://www.computerenhance.com/p/clean-code-horrible-performance',
        likes: 538
      }
    
      await api
        .post('/api/blogs')
        .set('Authorization', getAuthToken(username, id))
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const currentBlogs = await getBlogsFromDb()
      assert.strictEqual(currentBlogs.length, blogs.length + 1)
    
      const titles = currentBlogs.map(blog => blog.title)
      assert(titles.includes('"Clean" Code, Horrible Performance'))
    })
    
    test('likes default to zero', async () => {
      const newBlog = {
        title: '"Clean" Code, Horrible Performance',
        author: 'Casey Muratori',
        url: 'https://www.computerenhance.com/p/clean-code-horrible-performance',
      }
    
      await api
        .post('/api/blogs')
        .set('Authorization', getAuthToken(username, id))
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const currentBlogs = await getBlogsFromDb()
      const addedBlog = currentBlogs.find(blog => blog.title === newBlog.title)
    
      assert.strictEqual(addedBlog.likes, 0)
    })
    
    test('blog without title is not added', async () => {
      const newBlog = {
        author: 'Casey Muratori',
        url: 'https://www.computerenhance.com/p/clean-code-horrible-performance',
        likes: 538
      }
    
      await api
        .post('/api/blogs')
        .set('Authorization', getAuthToken(username, id))
        .send(newBlog)
        .expect(400)
    
      const currentBlogs = await getBlogsFromDb()
    
      assert.strictEqual(currentBlogs.length, blogs.length)
    })
    
    test('blog without url is not added', async () => {
      const newBlog = {
        title: '"Clean" Code, Horrible Performance',
        author: 'Casey Muratori',
        likes: 538
      }
    
      await api
        .post('/api/blogs')
        .set('Authorization', getAuthToken(username, id))
        .send(newBlog)
        .expect(400)
    
      const currentBlogs = await getBlogsFromDb()
    
      assert.strictEqual(currentBlogs.length, blogs.length)
    })

    test('adding blog without jwt fails', async () => {
      const newBlog = {
        title: '"Clean" Code, Horrible Performance',
        author: 'Casey Muratori',
        url: 'https://www.computerenhance.com/p/clean-code-horrible-performance',
        likes: 538
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    
      const currentBlogs = await getBlogsFromDb()
    
      assert.strictEqual(currentBlogs.length, blogs.length)
    })
  })
  
  describe('delete blog', () => {
    test('successful deletion', async () => {
      let currentBlogs = await getBlogsFromDb()
      const blogToDelete = currentBlogs[0]
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', getAuthToken(username, id))
        .expect(204)
  
      currentBlogs = await getBlogsFromDb()
  
      assert.strictEqual(currentBlogs.length, blogs.length - 1)
  
      const titles = currentBlogs.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })

    test('non-existant id fails', async () => {
      const invalidId = await nonExistingId()
  
      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', getAuthToken(username, id))
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      const currentBlogs = await getBlogsFromDb()
  
      assert.strictEqual(currentBlogs.length, blogs.length)
    })

    test('deleting blog without jwt fails', async () => {
      let currentBlogs = await getBlogsFromDb()
      const blogToDelete = currentBlogs[0]
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)
  
      currentBlogs = await getBlogsFromDb()
  
      assert.strictEqual(currentBlogs.length, blogs.length)
    })
    
    test('deleting other user\'s blog fails', async () => {
      const newBlog = new Blog({
        title: '"Clean" Code, Horrible Performance',
        author: 'Casey Muratori',
        url: 'https://www.computerenhance.com/p/clean-code-horrible-performance',
        likes: 538,
        user: await nonExistingId()
      })

      await newBlog.save()
  
      await api
        .delete(`/api/blogs/${newBlog.id}`)
        .set('Authorization', getAuthToken(username, id))
        .expect(401)
        .expect('Content-Type', /application\/json/)
  
      const currentBlogs = await getBlogsFromDb()
  
      assert.strictEqual(currentBlogs.length, blogs.length + 1)
    })
  })
  
  describe('update blog', () => {
    test('successfully update likes', async () => {
      let currentBlogs = await getBlogsFromDb()
      const blogToUpdate = { ...currentBlogs[0], likes: 100 }
  
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      currentBlogs = await getBlogsFromDb()
  
      assert.strictEqual(currentBlogs[0].likes, 100)
    })
  
    test('non-existant id fails', async () => {
      const invalidId = await nonExistingId()
  
      const newBlog = {
        title: '"Clean" Code, Horrible Performance',
        author: 'Casey Muratori',
        url: 'https://www.computerenhance.com/p/clean-code-horrible-performance',
        likes: 538
      }
  
      await api
        .put(`/api/blogs/${invalidId}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})