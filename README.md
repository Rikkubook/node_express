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
  * PATCH: {{url}}/users/{{id}} 編輯單筆使用者 (帶name或者email)
  * DELETE: {{url}}/users 刪除多筆使用者
  * DELETE: {{url}}/users/{{id}} 刪除單筆使用者


