const express = require("express");
const router = express.Router();
const { registerController, loginController,findUserById,getMeController,userCountsController,deleteUserController,updateUserInfo} = require("../controllers/user");
const { checkAuth } = require("../middlewares/check_auth");

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', checkAuth, getMeController);
router.put('/update-user-information', updateUserInfo);
router.get('findUserById/:userId', findUserById);
router.get('updateUserInfo/:userId', updateUserInfo);
router.delete('/:userId', deleteUserController);
router.get('/getUsersCounts', userCountsController);

module.exports = router;