const port = process.env.PORT || 3000; 
const jsonServer = require('json-server')
const cors = require('cors')
const auth = require('json-server-auth')

const app = jsonServer.create()
const router = jsonServer.router('./server/db.json')
const rules = auth.rewriter({
    questions: 664,
  })
app.db = router.db
app.use(cors())
app.use(rules)
app.use(auth)
app.use(router)
app.listen(port)