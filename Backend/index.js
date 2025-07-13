require("dotenv").config();
const express = require(`express`);
const cors = require(`cors`);
const bodyParser = require(`body-parser`);

const { connectToDB } = require(`./utils/db`)
const authRouter = require(`./routers/auth-router`);

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

/* ;
app.use(`${process.env.API_BASE_URL}/query`, queryRouter);
app.use(`${process.env.API_BASE_URL}/aggre`, aggreRouter);
 */


/* -------DB Connection------- */
connectToDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Connected To DB, Sever Started At Port:${PORT}`) 
    );
  })
  .catch((err) => console.log(`Server Crashed with error: ${err}`));