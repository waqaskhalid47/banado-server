const express = require("express");
let router = express.Router();
var { User,UserDetails,SellerDetails,BuilderDetails,AdminDetails } = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const validateNewUser = require("../../middlewares/validateUser");
const validateUser = require("../../middlewares/validatelogin");


//register

router.post("/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send("User already exists");

  user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.role=req.body.role;

  await user.generateHashedPassword();
  await user.save();


//Save additional details

if(user.role=="user"){
  console.log(user.contact);
userDeatils=new UserDetails();

userDeatils.cnic=req.body.cnic;

userDetails.userID=user._id;

await userDetails.save();
}
else if(user.role=="seller"){
  
sellerDetails= new SellerDetails();
sellerDetails.contact=req.body.contact;
sellerDetails.storeName=req.body.storeName;

sellerDetails.sellerId=user._id;
await sellerDetails.save();
}
else if(user.role== "builder"){

  builderDetails= new BuilderDetails();
builderDetails.contact=req.body.contact;
builderDetails.companyName=req.body.companyName;
  builderDetails.builderId=user._id;

  await builderDetails.save();
}
else if(user.role== "admin"){

  adminDetails= new AdminDetails();
adminDetails.hobby=req.body.hobby;

  adminDetails.adminId=user._id;

  await adminDetails.save();
}




  let token = jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    config.get("jwtprivatekey")
  );

  returnData = { name: user.name, email: user.email, token: token };
  return res.send(returnData);
});


//login 

router.post("/login", validateUser, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Username doesn't exist");
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("Password incorrect!");

  
 
  if(user.role=="user"){
    let details=await UserDetails.findOne({ userId: user._id });
    let token = jwt.sign(
      { id: user._id, name: user.name, role: user.role,details },
      config.get("jwtprivatekey")
    );
    return res.send({token,details});
      }

    if(user.role=="seller"){
      let details=await SellerDetails.findOne({ sellerId: user._id });
      let token = jwt.sign(
        { id: user._id, name: user.name, role: user.role,details },
        config.get("jwtprivatekey")
      );
      return res.send({token,details});
      }

      if(user.role=="builder"){
        let details=await BuilderDetails.findOne({ builderId: user._id });
        let token = jwt.sign(
          { id: user._id, name: user.name, role: user.role,details },
          config.get("jwtprivatekey")
        );
        return res.send({token,details});      }
        
      if(user.role=="admin"){
        let details=await AdminDetails.findOne({ adminId: user._id });
        let token = jwt.sign(
          { id: user._id, name: user.name, role: user.role,details },
          config.get("jwtprivatekey")
        );
        return res.send({token,details});
        
      }

  
  
});

module.exports = router;
