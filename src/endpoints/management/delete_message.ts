import { ServerRoute } from "@hapi/hapi";
import boom from "@hapi/boom";
import { db } from "@/main";
import Joi from "joi";

const data: ServerRoute = {
	method: `DELETE`, path: `/manage/{channel}/message/{id}`,
	options: {
		validate: {
			params: Joi.object({
				channel: Joi.string().alphanum(),
				id: Joi.string().uuid(),
			}),
		},
	},
	async handler(request, h) {
		const { channel, id } = request.params;

		if (!db[channel]) {
			throw boom.notFound(`Invalid channel`);
		};

		if (!db[channel].messages[id]) {
			throw boom.notFound(`Invalid ID`);
		};

		let message = db[channel].messages[id];
		delete db[channel].messages[id];

		return h.response(message).code(200);
	},
};
export default data;