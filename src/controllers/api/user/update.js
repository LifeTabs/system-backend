import * as request from "#request"
import Users from "#users"
import response from "#response"
import { onlyUser } from "../../../middlewares/Authentication.js"
const params = [
  "email",
  "password",
  "name"
]

const view = (req, res) => {
  const paramsUpdate = request.only(req, params)
  const uuid = req.user.uuid
  const user = Users()
  user.update({
    where: {
      uuid,
    },
    data: paramsUpdate
  })
  .then((user) => {
    res.send(response.send_success(user))
  })
}

const middlewares = [
  onlyUser
]

export default {
  view,
  middlewares
}