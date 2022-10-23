
import response from "#response"
import Users from "#users"
import { onlyUser } from "../../../middlewares/Authentication.js"
const view = (req, res) => {
  const user = Users()
  user.findUnique({
    where: {
      uuid: req.user.uuid
    }
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