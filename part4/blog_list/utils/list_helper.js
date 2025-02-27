const dummy = blogs => 1

const totalLikes = blogs => blogs.length ? blogs.reduce((sum, blog) => sum + blog.likes, 0) : 0

const favoriteBlog = blogs => {
  if (!blogs.length) {
    return undefined
  }

  const blog = blogs.find(blog => blog.likes === Math.max(...blogs.map(blog => blog.likes)))

  return { title: blog.title, author: blog.author, likes: blog.likes }
}

const mostBlogs = blogs => {
  if (!blogs.length) {
    return undefined
  }

  const blogCounts = new Map()
  let mostFrequentAuthor = blogs[0].author
  let highestCount = 0

  blogs.forEach(blog => {
    const currentCount = (blogCounts.get(blog.author) ?? 0) + 1

    if (currentCount > highestCount) {
      mostFrequentAuthor = blog.author
      highestCount = currentCount
    }

    blogCounts.set(blog.author, currentCount)
  })

  return { author: mostFrequentAuthor, blogs: highestCount }
}

const mostLikes = blogs => {
  if (!blogs.length) {
    return undefined
  }

  const likeCounts = new Map()
  let mostLikesAuthor = blogs[0].author
  let highestLikes = 0

  blogs.forEach(blog => {
    const currentLikes = (likeCounts.get(blog.author) ?? 0) + blog.likes

    if (currentLikes > highestLikes) {
      mostLikesAuthor = blog.author
      highestLikes = currentLikes
    }

    likeCounts.set(blog.author, currentLikes)
  })

  return { author: mostLikesAuthor, likes: highestLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}