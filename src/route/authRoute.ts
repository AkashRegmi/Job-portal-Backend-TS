import express ,{Router} from "express"
import { registerUser,login } from "../controller/auth";
import {body} from "express-validator"
import validate from "../middleware/validatormiddleware"
import { registerValidator, loginValidator} from "../Validator/authValidator";
const router:Router = express.Router();


 router.post("/register", registerValidator,registerUser)
 router.post("/login",loginValidator,login)

 export default router;
