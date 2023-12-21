# express 版的 

* express-generator
* dotenv
* mongoose
* 抽共用的 errorHandler, successHandle, header, errorMsg

## TodoList (/todo)
* 目錄
  * GET : {{url}}/todo 取得多筆代辦
  * POST: {{url}}/todo 新增單筆代辦 (帶title)
  * DELETE: {{url}}/todo 刪除多筆代辦
* 內頁
  * PATCH: {{url}}/todo/{{id}} 編輯單筆代辦 (帶title)
  * DELETE: {{url}}/todo/{{id}} 刪除單筆代辦

## Posts (/posts)
* 目錄
  * GET : {{url}}/posts 取得多筆文章
  * POST: {{url}}/posts 新增單筆文章 (帶userID、content)
  * DELETE: {{url}}/posts 刪除多筆文章
* 內頁
  * PATCH: {{url}}/posts/{{id}} 編輯單筆文章 (帶content)
  * DELETE: {{url}}/posts/{{id}} 刪除單筆文章
* 收藏
  * GET : {{url}}/posts/likes 取得多筆收藏 (帶userID)
  * POST: {{url}}/posts/postLikes 新增取消收藏文章 (帶userID、posts)
  * DELETE: {{url}}/posts/likes 刪除多筆收藏

## Users (/users)
* 目錄
  * GET : {{url}}/users 取得多筆使用者
  * POST: {{url}}/users 新增單筆使用者 (帶name、email)
  * DELETE: {{url}}/users 刪除多筆使用者
* 內頁
  * PATCH: {{url}}/users/{{id}} 編輯單筆使用者 (帶name或者email)
  * DELETE: {{url}}/users/{{id}} 刪除單筆使用者

-----------------
## Students (/students)
* 目錄
  * GET : {{url}}/students 取得所有學生資訊
  * DELETE: {{url}}/students 刪除所有學生資訊
* 內頁
  * GET : {{url}}/students/{{id}} 取得學生單筆資訊
  * POST: {{url}}/students/{{id}} 新增單筆使用者
  * PATCH: {{url}}/students/{{id}} 編輯單筆使用者 (帶age、major或者scholarship)
  * DELETE: {{url}}/students/{{id}} 刪除學生單筆資訊

# 搭配EJS 使用
## 登入、註冊
* 畫面
  * GET: {{url}}/students/signUp 註冊畫面
  * GET: {{url}}/students/login 登入畫面
  * GET: {{url}}/students/studentsList 學生列表畫面
  * GET: {{url}}/students/studentsList/{{id}} 學生資料畫面轉頁用
  * GET: {{url}}/students/studentInsert/{{id}} 新增學生資料畫面
  * GET: {{url}}/students/studentEdit/{{id}} 編輯學生資料畫面
  * GET: {{url}}/students/studentPage/{{id}} 呈現學生資料畫面
* API
  * POST: {{url}}/students/singUp 新增註冊 (帶email、name、password)
  * POST: {{url}}/students/login 輸入登入 (帶email、password)
  * POST: {{url}}/students/studentInsert/{{id}} 新增學生資料
  * POST: {{url}}/students/studentInsert/{{id}} 修改學生資料 (帶age、major或者scholarship) 
    * 因為前端是由form 表單送出不可為PATCH
  * Get: {{url}}/students/studentDelete/{{id}} 刪除學生資料





