const express = require('express');
const router = express.Router();
const { isAuth } = require('../service/auth')
const { memberControl, studentViewControl, studentControl}= require('../controllers/studentControllers');

// 註冊畫面
router.get("/signup", memberControl.getSignup)
// 註冊API
router.post("/signup", memberControl.postSignup)

// 登入畫面
router.get("/login", memberControl.getLogin)
// 登入API
router.post("/login", memberControl.postLogin)

// 學生列表畫面
router.get("/studentsList", isAuth, studentViewControl.getStudentsList)
// 個人資料畫面
router.get("/studentsList/:id", isAuth, studentViewControl.getStudent)
// 個人新增畫面
router.get("/studentInsert/:id", isAuth, studentViewControl.getStudentInsert)
// 個人編輯畫面
router.get("/studentEdit/:id", isAuth,  studentViewControl.getStudentEdit)
// 個人呈現畫面
router.get("/studentPage/:id", isAuth, studentViewControl.getStudentPage)
// 個人刪除畫面
router.get("/studentDelete/:id", isAuth, studentViewControl.getStudentDelete)
// 錯誤畫面
router.get("/errorPage", studentViewControl.getErrorPage)

// 個人新增API
router.post("/studentInsert/:id", studentViewControl.postStudentInsert)
// 個人修改API
router.post("/studentEdit/:id", studentViewControl.postStudentEdit)



//------------------------------------

// 個人資料API CRUD
router.get('/', studentControl.getStudentsList);

router.get('/:id', studentControl.getStudentPage);

router.post('/:id', studentControl.postStudentPage);

router.patch('/:id', studentControl.patchStudentPage);

router.delete('/', studentControl.deleteStudentsList);

router.delete('/:id', studentControl.deleteStudentPage);

module.exports = router;