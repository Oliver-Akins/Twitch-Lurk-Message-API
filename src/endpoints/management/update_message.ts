import { ServerRoute } from "@hapi/hapi";
import boom from "@hapi/boom";
import { db } from "@/main";
import Joi from "joi";

const data: ServerRoute = {
	method: `PATCH`, path: `/manage/{channel}/message/{id}`,
	options: {
		validate: {
			payload: Joi.object({
				lurk: Joi.array().items(Joi.string().min(1)).min(1),
				unlurk: Joi.array().items(Joi.string().min(1)).min(1),
			}),
			params: Joi.object({
				channel: Joi.string().alphanum(),
				id: Joi.string().uuid(),
			}),
		},
	},
	async handler(request, h) {
		const { channel, id } = request.params;
		const data = request.payload as lurk_message;

		if (!db[channel]) {
			throw boom.notFound(`Invalid channel`);
		};

		db[channel].messages[id] = data;

		return h.response(`Updated message set with ID: ${id}`).code(200);
	},
};
export default data;