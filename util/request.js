const only = (req, params) => {
  const data = {}
  params.forEach((param) => {
    data[param] = req.param(param)
  })
  return data
}

export {
  only
}