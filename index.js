const express=require('express')
const PORT=5000
const app = express()
var cors=require('cors')

app.use(cors())
app.use(express.json())


app.use('/user',require('./routes/userAuth'))
app.use('/cars',require('./routes/managecars'))
app.use('/booking',require('./routes/booking'))
app.use('/admin',require('./routes/admin'))


app.listen(PORT,()=>{
    console.log(`Example app listening on port http://localhost:${PORT}`)

})