import { ServerRoute } from "@hapi/hapi";
import boom from "@hapi/boom";
import { db } from "@/main";

const data: ServerRoute = {
	method: `GET`, path: `/manage/{channel}`,
	async handler(request, h) {
		const { channel } = request.params;

		if (!db[channel]) {
			throw boom.notFound(`Invalid channel`);
		};

		let messages = [];
		for (const messageId in db[channel].messages) {
			let message = db[channel].messages[messageId];
			messages.push({
				id: messageId,
				lurk: message.lurk,
				unlurk: message.unlurk,
			});
		};

		return h.response(messages).code(200);
	},
};
export default data;