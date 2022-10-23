import { faker } from '@faker-js/faker';
import { v4 as uuid } from "uuid"
import Users from "../Model/Users.js"
for(let i = 0; i < 100; i++) {
  const randomName = faker.name.fullName();
  const randomEmail = faker.internet.email();
  const userUuid = uuid()
  const user = new Users()
  user.create({
    data: {
      name: randomName,
      email: randomEmail,
      uuid: userUuid,
    }
  })
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  })
}
