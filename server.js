import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import data from './Data/data.js'
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js'
import orderRouter from './routers/orderRouter.js';
import departmentRouter from './routers/departmentRouter.js';
import blogRouter from './routers/blogRouter.js';
import cors from 'cors';

// give mailing feature to the app without using any third party service
import mailer from 'express-mailer';



dotenv.config();

const app = express();
app.options('*', cors())

// mine
mailer.extend(app, {
    from: process.env.FROM_MAILID,
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: process.env.FROM_MAILID,
        pass: process.env.FROM_MAILID_PASSWORD
    }
});


// mine

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
})
}).catch((error) => {
    console.log(error.reason);
});

// mongoose.connect(process.env.MONGO_CONNECTION_STRING, {}, function(err) {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('Connected to database');
//     }
// });


app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/departments', departmentRouter)
app.use('/api/blogs', blogRouter)

app.use('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})




app.get('/api/phones', (req, res) => {
    res.send(data.phones)
})



app.get('/', (req, res) => {
    res.send('Server Started')
})

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});



// app.listen(port, () => {
//     console.log(`Server at http://localhost:${port}`)
// })
