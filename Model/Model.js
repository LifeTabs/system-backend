import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class Model {
	prisma = prisma;
	constructor() {

	}
}
export default Model;