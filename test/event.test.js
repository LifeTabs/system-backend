import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const userId = 13;
const getByUser = () => {
	return prisma.BackgroundJobs.findFirst({
		where: {
			Event: {
				full_date: {
					gt: new Date(),
				},
				userId: userId,
			},
		},
		include: {
			Event: {
				include: {
					User: {
						include: {
							Subscribers: true,
						},
					},
				},
			},
		},
		orderBy: {
			Event: {
				full_date: "asc",
			},
		},
		distinct: ["userId"],
	})
		.then((res) => {
			console.log(res);
		});
};

getByUser();