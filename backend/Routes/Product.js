const exprees=require("express")
const router=exprees.Router()

const{auth,IsConsumer,Admin}=require("../middelware/auth")
const {createProduct,updateProduct,deleteProduct,getprodact,getAllProduct,getProductById}=require("../Controllers/Product")
const {RateingAndReview,allreating,getRatingById,getRatingAndReviewById}=require("../Controllers/RateingAndReview")
const {createCart,addToProduct,updateCart,initializeCart, getCart,removeFromCart}=require("../Controllers/Cart")
const {getorder,placeorder}=require("../Controllers/orderController")
const{setAddress,getAddress}=require("../Controllers/addersController")

//Product Routes
router.post("/createProduct",auth,createProduct);
router.post("/updateProduct",auth,updateProduct);
router.post("/deleteProduct",auth,deleteProduct);
router.post("/getProduct",getprodact);
router.get("/getAllProduct",getAllProduct);
router.get("/getProductById/:ProductId", getProductById);


//cart routes
router.post("/createCart",auth,createCart);
router.post("/updateCart",updateCart);
router.post("/addToProduct",auth,addToProduct);
router.post("/initializeCart",initializeCart);
router.get("/getCart",getCart);
router.post("/removeFromCart",auth,removeFromCart);
//Rating and Review Routes
router.post("/RatingAndReview",auth,RateingAndReview);
router.get("/allReating",allreating)
router.get("/getRatingById",auth,getRatingById);
router.get("/getRatingAndReviewById/:productId", getRatingAndReviewById);

//Order Route
router.post("/placeorder",auth,placeorder);
router.post("/getorder",auth,getorder)


//Address Routes
router.post("/setAdderss",auth,setAddress)
router.get("/getAddress",auth,getAddress)

module.exports=router;