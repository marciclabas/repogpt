import express from 'express'
import SSE from 'express-sse-ts'
import { summarize } from './summarize';


const app = express();
const sse = new SSE()

app.get('/stream', sse.init)

app.get('/summarize', async (req, res) => {
  const { url } = req.query
  if (!url) {
    res.status(422).send('Missing URL. Expected ?url=URL')
    return
  }
  
  res.send(`Summarizing ${url}...`);
  for await (const progress of summarize(url as string, { log: console.log })) {
    sse.send(JSON.stringify(progress))
  }
})


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})