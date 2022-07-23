const serverless = require('serverless-http')
const express = require('express')

const { createVideo, getVideos, deleteVideo } = require('./src/services/videos.service')

const app = express()

app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'AFEX TEST',
  })
})

app.get('/videos', async (req, res) => {
  const videos = await getVideos()

  return res.status(200).json({
    videos,
  })
})

app.post('/videos', async (req, res) => {
  const { title, description, url, img } = JSON.parse(req.body)
  if (!title || !description || !url || !img) {
    return res.status(400).json({
      message: 'Missing required fields',
    })
  }

  try {
    const videos = await createVideo({ title, description, url, img })

    return res.status(200).json({
      videos,
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
})

app.delete('/videos/:id', async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({
      message: 'Missing required fields',
    })
  }

  try {
    const videos = await deleteVideo(id)

    return res.status(200).json({
      videos,
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
})

app.use((req, res, next) => {
  return res.status(200).json({
    error: 'Not Found',
  })
})

module.exports.handler = serverless(app)
