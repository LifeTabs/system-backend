import { PrismaClient } from "@prisma/client"
import { v4 as uuid } from 'uuid';
import md5 from "md5"
// import Model from "./Model.js"
const prisma = new PrismaClient()

function Users () {
  const prismaUser = prisma.user
  const cast2Hash = [
    "password"
  ]
  const createHash = (params) => {
    cast2Hash.forEach(hash => {
      if(Object.getOwnPropertyNames.call(params, hash)){
        params[hash] = md5(params[hash])
      }
    });
    return params
  }
  const callbacks = {
    update (params) {
      const res = createHash(params.data)
      params.data = res
      return params
    },
    findMany(params) {
      const res = createHash(params.where)
      params.where = res
      return params
    }
  }
  const overWrites = {
    createUser () {
      return prismaUser.create({
        data: {
          uuid: uuid()
        }
      })
    }
  }
  const user = new Proxy(prismaUser, {
    get (target, key) {
      /**
       * // TODO Binding new function
       * @param  {...any} args Get all args from function
       * @returns function
       */
      const handler = (...args) => {
        const func = overWrites[key] ? overWrites[key] : target[key]
        return func.apply(target, callbacks[key] ? [callbacks[key](...args)] : args)
      }
      return handler
    }
  })
  return user
}
export default Users