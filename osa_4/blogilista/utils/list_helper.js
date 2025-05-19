const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, current) => {
    return (current.likes > favorite.likes)
      ? current
      : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const countsByAuthor = Object.entries(_.countBy(blogs, 'author'))

  const topAuthor = _.maxBy(countsByAuthor, ([, count]) => count)
  return {
    author: topAuthor[0],
    blogs: topAuthor[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogsByAuthor = Object.entries(_.groupBy(blogs, 'author'))

  const likesByAuthor = blogsByAuthor.map(([author, authorBlogs]) => {
    const totalLikes = _.sumBy(authorBlogs, 'likes')
    return {
      author,
      likes: totalLikes
    }
  })

  const topAuthor = _.maxBy(likesByAuthor, 'likes')

  return topAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}