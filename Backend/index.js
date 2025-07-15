require("dotenv").config();
const express = require(`express`);
const cors = require(`cors`);
const bodyParser = require(`body-parser`);

const { connectToDB } = require(`./utils/db`)
const authRouter = require(`./routers/auth-router`);
const cartRouter = require(`./routers/cart-router`);
const orderRouter = require(`./routers/order-router`);
const productRouter = require(`./routers/product-router`);
const { Product } = require('./models/product-model');

const PORT = process.env.PORT || 3000;

if(!process.env.DB_URI){
    console.error('Missing required environment variables');
    process.exit(1);
}

const app = express();

app.use(bodyParser.json());
app.use(cors())

/* -----------API Routes--------------- */

app.use(`${process.env.API_BASE_URL}/auth`, authRouter);
app.use(`${process.env.API_BASE_URL}/order`, orderRouter);
app.use(`${process.env.API_BASE_URL}/store`, productRouter);
app.use(`${process.env.API_BASE_URL}/checkout`, cartRouter);


/* -------DB Connection------- */
connectToDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Connected To DB, Sever Started At Port:${PORT}`) 
    );

    /* (async () => {
      const insertedProducts = await Product.insertMany(productsData);
      console.log(`Successfully inserted ${insertedProducts.length} products!`);
    })() */
  })
  .catch((err) => console.log(`Server Crashed with error: ${err}`));