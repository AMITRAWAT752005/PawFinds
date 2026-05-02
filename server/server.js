require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const petRouter = require('./Routes/PetRoute')
const AdoptFormRoute = require('./Routes/AdoptFormRoute')
const AdminRoute = require('./Routes/AdminRoute')
const cors = require('cors');
const path = require('path');
const userRouter = require('./Routes/UserRoute')
const OtpRouter = require('./Routes/OtpRoute')
const requireAuth = require('./Middleware/requireAuth')
const DashboardRouter = require('./Routes/DashboardRoute')

const app = express();

app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api', OtpRouter)
app.use(userRouter)
app.use('/dashboard', DashboardRouter)

// Apply requireAuth middleware only to protected routes
app.use('/requests', requireAuth, petRouter)
app.use('/approvedPets', requireAuth, petRouter)
app.use('/adoptedPets', requireAuth, petRouter)
app.use('/approving', requireAuth, petRouter)
app.use('/delete', requireAuth, petRouter)
app.use('/services', requireAuth, petRouter)
app.use('/form', requireAuth, AdoptFormRoute)

app.use('/admin', AdminRoute)

mongoose.connect(process.env.dburl)
    .then(() => {
        console.log('Connected to DB');
        const PORT = 4000;
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error(err);
    })


 