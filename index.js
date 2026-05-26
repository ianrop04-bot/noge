const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const yts = require('yt-search')
const axios = require('axios') // ← MISSING: axios not imported
const path = require('path')

const E = 'groupanimators4@gmail.com'
const P = 'pmzg eboq hrrv czbp'

const app = express()
app.use(cors())
app.use(express.json())


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: E,
    pass: P
  }
})

app.post('/send-email', async (req, res) => {
  const { name, message, email, subject } = req.body
  try {
    await transporter.sendMail({
      from: `"${name}" <${E}>`,
      to: email,
      subject: subject,
      text: 'Message From ' + name,
      html: `${message}<br><p>follow us on <a href='https://whatsapp.com/channel/0029Vb71mgIElaglZCU0je0x'>whatsApp</a></p>`
    })
    res.json({ ok: true, message: 'Sent Successfully' })
  } catch (error) {
    res.json({ message: error.message })
  }
})

const API_KEY = '89802458aff508c9c6eff8b7290d8970' // ← Add your TMDB API key here

// FIXED: Typo in route (was '/search/movie/:movie', should use req.params correctly)
app.get('/search/movie/:movie', async (req, res) => {
  const { movie } = req.params
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: API_KEY,
        query: movie, // ← MISSING: wasn't using the movie param
        page: req.query.page || 1
      }
    })
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' })
  }
})

// FIXED: Missing '/' at start, typo in 'vedio'
app.post('/search/yts/video', async (req, res) => {
  const { url } = req.body
  try {
    const results = await yts(url)
    const video = results.videos[0]
    res.json({
      success: true, // ← FIXED: Typo 'succcess'
      title: video.title,
      duration: video.duration,
      url: video.url,
      author: video.author.name,
      description: video.description,
      upload: video.ago
    })
  } catch (error) {
    res.json({ error: error.message }) // ← FIXED: Typo 'errror'
  }
})

app.get('/', (req, res) => {
  res.send('Hey Welcome To creative Hub API')
})



app.listen(8058, () => {
  console.log('Site Online Connection')
})
