const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { blogs, listWithOneBlog } = require('./test_helper')

test('dummy returns one', () => {
  const result = listHelper.dummy([])
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('sum all likes', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  test('empty array returns zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  test('single blog returns itself', () => {
    const test = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5
    }

    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, test)
  })

  test('returns most liked blog', () => {
    const test = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, test)
  })

  test('empty array returns undefined', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, undefined)
  })
})

describe('most blogs', () => {
  test('single blog returns author and count', () => {
    const test = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }

    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, test)
  })

  test('returns most frequent author', () => {
    const test = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, test)
  })

  test('empty array returns undefined', () => {
    const result = listHelper.mostBlogs([])
    assert.deepStrictEqual(result, undefined)
  })
})

describe('most likes', () => {
  test('single blog returns author and likes', () => {
    const test = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }

    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, test)
  })

  test('returns most liked author', () => {
    const test = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, test)
  })

  test('empty array returns undefined', () => {
    const result = listHelper.mostLikes([])
    assert.deepStrictEqual(result, undefined)
  })
})