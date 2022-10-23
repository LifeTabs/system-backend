import home from "../src/controllers/home.js"
import signup from "../src/controllers/api/user/signup.js"
import login from "../src/controllers/api/user/login.js"
import updateUser from "../src/controllers/api/user/update.js"
import UserInfo from "../src/controllers/api/user/info.js"

const routers = [
  {
    method: "get",
    path: "/",
    controller: home
  },
  {
    method: "post",
    path: "/api/user/signup",
    controller: signup
  },
  {
    method: "post",
    path: "/api/user/login",
    controller: login
  },
  {
    method: "patch",
    path: "/api/user",
    controller: updateUser
  },
  {
    method: "get",
    path: "/api/user",
    controller: UserInfo
  },
]
export default routers