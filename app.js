require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');

const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const cookieParser = require('cookie-parser');
//Routes
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/user.js');
const productsRouter = require('./routes/product');
const reviewsRouter = require('./routes/review');
const ordersRouter = require('./routes/order');

const morgan = require('morgan');

const connectDb = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);

app.use(rateLimiter({ windowMs: 15 * 60 * 1000 }));

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());
app.use(express.static('./public'));
app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies), res.send('Test');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/orders', ordersRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 1234;
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(port);
    console.log(`Serv. is listening on port: ${port}`);
  } catch (error) {
    console.log(error);
  }
};
start();
