import { ServerRoute } from "@hapi/hapi";
import boom from "@hapi/boom";
import { db } from "@/main";
import Joi from "joi";

const data: ServerRoute = {
	method: `POST`, path: `/manage`,
	options: {
		validate: {
			payload: Joi.object({
				channel: Joi.string().alphanum(),
				default_unlurk: Joi.string().min(1),
			}),
		},
	},
	async handler(request, h) {
		const { channel, default_unlurk } = request.payload as post_channel_payload;

		if (!db[channel]) {
			throw boom.notFound(`Invalid channel`);
		};

		db[channel].lurkers = {};
		db[channel].unlurk_default = default_unlurk;
		db[channel].messages = {};

		return h.response().code(200);
	},
};
export default data;