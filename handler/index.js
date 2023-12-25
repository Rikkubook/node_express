const errorMsg = {
  '400': 'Bad Request 格式不正確',
  '401': 'Unathorized',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Nor Acceptable'
}

const successHandler = (res, data) => {
  console.log('successHandler')
  res.status(200).json({
    status:"success",
    data
  })
}

const errorHandler = (res, error= null, code=400) => {
  console.log('errorHandler')
  res.status(code).json({
    status: "false",
    message: error? error.message: errorMsg[code],
    error: error
  });
}

module.exports={
  successHandler,
  errorHandler
}