const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const { protect , authorizeRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//prtected routes
router.get("/profile", protect, (req, res) => {     //user tries to access /profile
  res.json({                                        // protect middleware runs first 
    message : "Profile accessed",                   // it checks JWT token valiid or not if valid then next() else 401 error
    user : req.user,
  });

});

//authorization role based routing
router.get("/recruiter-dashboard",
  protect,
  authorizeRole("recruiter"),
  (req,res) => {
    res.json({
      message : "Welcome Recruiter",
      user : req.currentUser
    })
  }
)
module.exports = router;