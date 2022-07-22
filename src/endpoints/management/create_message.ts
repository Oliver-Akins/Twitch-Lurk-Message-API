import { ServerRoute } from "@hapi/hapi";
import boom from "@hapi/boom";
import { db } from "@/main";
import { v4 } from "uuid";
import Joi from "joi";

const data: ServerRoute = {
	method: [`POST`, `PUT`], path: `/manage/{channel}/message`,
	options: {
		validate: {
			payload: Joi.object({
				lurk: Joi.array().items(Joi.string().min(1)).min(1),
				unlurk: Joi.array().items(Joi.string().min(1)).min(1),
			}),
			params: Joi.object({
				channel: Joi.string().alphanum(),
			}),
		},
	},
	async handler(request, h) {
		const { channel } = request.params;
		const data = request.payload as lurk_message;
		const id = v4();

		if (!db[channel]) {
			throw boom.notFound(`Invalid channel`);
		};

		db[channel].messages[id] = data;

		return h.response({
			lurk: data.lurk,
			unlurk: data.unlurk,
			id,
		}).code(200);
	},
};
export default data;