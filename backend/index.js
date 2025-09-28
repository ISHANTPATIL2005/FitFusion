const express=require("express")
const App=express();
const dotenv = require("dotenv");

PORT=process.env.PORT||5001;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { connectCloudinary } = require("./config/cloudinary");
//const { connectCloudinary } = require("./config/cloudinary");


const userRoutes=require("./Routes/User")
const productRoutes=require("./Routes/Product")

const database=require("./config/database")
database.connect();

App.use(express.json())
App.use(cookieParser());
App.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
App.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
connectCloudinary();
App.use("/api/v1/user",userRoutes)
App.use("/api/v1/Product",productRoutes)


App.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
