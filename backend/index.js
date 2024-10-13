import 'dotenv/config'
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { handlePostLimit } from './controllers/user.controller.js';
import cron from 'node-cron';
const port = process.env.PORT || 8000;
connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`server is running at port ${port}`)

    })
    cron.schedule("0 0 * * *",handlePostLimit)
    

})
.catch((err) => {
    console.log('mongodb connection failed!',err);
    
})



