const express = require("express");
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require("mongoose");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const orderRouter = require("./routes/order");
const userRouter = require("./routes/user");
const cors = require('cors');
app.use(cors());
app.options('*', cors());


//connecting to the data base
const connectDB = async ()=>{
    const connect = await mongoose.connect(process.env.DB_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => console.log("connected to database successfully"))
        .catch((err) => console.log(`error with connecting to the data base ${err}`));
}
connectDB();

app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());

//CORS
app.use((req, res, next) => {
    res.setHeader("Access-Controll-Allow-Orign", "*");
    res.setHeader("Access-Controll-Allow-Methods", "*");
    res.setHeader("Access-Controll-Allow-Headers", "Authorization");
    next();
});

//routes
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use('/order', orderRouter);
app.use('/auth', userRouter);

//handling not found the router error
app.use(async (req, res, next) => {
    next(Error("the router that you try to access it is not found"));
});

app.use((err, req, res, next) => {
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    });
});

app.listen(8000, () => {
    console.log("server on");
})