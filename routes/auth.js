const express = require("express");
const authController = require('../controllers/authcontrollers');

const router = express.Router();





router.post("/register", authController.register);

router.post('/login' ,authController.login);

router.post("/professorRegister", authController.professorRegister);

router.post("/CreateLesson", authController.CreateLesson);

router.post("/CreateReview", authController.CreateReview);

router.post("/SearchLesson", authController.SearchLesson);

module.exports = router;