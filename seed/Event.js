import Events from "#root/Model/Event.js";
const events = [
	{
		name: "Tết Dương Lịch",
		description: "Ngày lễ Tết Quốc tế của hầu hết các quốc gia.",
		date: "1/1",
		type_time: 1,
		schedule: 1, 
		country: "global",
		priority: 2,
	},
	{
		name: "Tết Nguyên Đán",
		description: "Tết cổ truyền dân tộc.",
		date: "1/1",
		type_time: 0,
		schedule: 1, 
		country: "vn",
		priority: 2,
	},
	{
		name: "Tết Nguyên Tiêu",
		description: "Lễ hội trăng rằm",
		date: "15/1",
		type_time: 0,
		schedule: 1, 
		country: "vn",
		priority: 2,
	},
	{
		name: "Giỗ Tổ Hùng Vương",
		description: "Tưởng nhớ đến công ơn dựng nước của các Vua Hùng.",
		date: "10/3",
		type_time: 0,
		schedule: 1,
		country: "vn",
		priority: 2,
	},
	{
		name: "Lễ Phật Đản",
		description: "Ngày sinh của đức Phật.",
		date: "8/4",
		type_time: 0,
		schedule: 1,
		country: "vn",
		priority: 3,
	},
	{
		name: "Ngày Giải phóng miền Nam, Thống nhất đất nước",
		description: "Ngày Giải phóng miền Nam, Thống nhất đất nước.",
		date: "30/4",
		type_time: 1,
		schedule: 1,
		country: "vn",
		priority: 2,
	},
	{
		name: "Ngày Quốc tế Lao động",
		description: "Kỷ niệm ngày của người lao động toàn thế giới.",
		date: "1/5",
		type_time: 1,
		schedule: 1,
		country: "global",
		priority: 2,
	},
	{
		name: "Tết Đoan Ngọ",
		description: "Tết Đoan Ngọ",
		date: "5/5",
		type_time: 0,
		schedule: 1,
		country: "vi",
		priority: 3,
	},
	{
		name: "Lễ Vu-lan",
		description: "Lễ báo hiếu",
		date: "15/7",
		type_time: 0,
		schedule: 1,
		country: "vi",
		priority: 3,
	},
	{
		name: "Tết Trung Thu",
		description: "Tết trông Trăng, Tết hoa đăng",
		date: "15/8",
		type_time: 0,
		schedule: 1,
		country: "vi",
		priority: 2,
	},
	{
		name: "Ngày Quốc khánh",
		description: "Kỷ niệm ngày Chủ tịch Hồ Chí Minh đọc tuyên ngôn độc lập.",
		date: "2/9",
		type_time: 1,
		schedule: 1,
		country: "vn",
		priority: 2,
	},
	{
		name: "Ngày Halloween",
		description: "Lễ hội hóa trang",
		date: "31/10",
		type_time: 1,
		schedule: 1,
		country: "global",
		priority: 2,
	},
	{
		name: "Lễ Giáng sinh",
		description: "Lễ hội kỷ niệm sự ra đời của Chúa Giêsu",
		date: "25/12",
		type_time: 1,
		schedule: 1,
		country: "global",
		priority: 2,
	},
	{
		name: "Ngày Đưa Ông Táo Về Trời",
		description: "Ngày Đưa Ông Táo Về Trời",
		date: "23/12",
		type_time: 0,
		schedule: 1,
		country: "vn",
		priority: 2,
	},
];
events.forEach(event => {
	const eventModel = new Events();
	eventModel.create({
		data: event
	})
		.then((res) => {
			console.log(res);
		})
		.catch((e) => {
			console.log(e);
		});
});