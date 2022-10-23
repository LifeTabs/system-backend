import Users from "#users"
import response from "#response"
import { onlyGuess } from "../../../middlewares/Authentication.js"

const view = (req, res) => {
  const newUser = new Users()
  newUser.createUser()
  .then((user) => {
    const data = {
      user
    }
    res.send(response.send_success(data))
  })
}

const middlewares = [
  onlyGuess,
]


export default {
  view,
  middlewares,
}