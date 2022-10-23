const view = (req, res, next) => {
  res.send("OK")
}

const middlewares = [
  (req, res, next) => {
    next()
  },

]
export default {
  view,
  middlewares
}