import { ServerRoute } from "@hapi/hapi";
import boom from "@hapi/boom";
import { db } from "@/main";
import Joi from "joi";

const data: ServerRoute = {
	method: `PATCH`, path: `/manage/{channel}`,
	options: {
		validate: {
			params: Joi.object({
				channel: Joi.string().alphanum(),
			}),
			payload: Joi.object({
				default_unlurk: Joi.string().min(1),
			}),
		},
	},
	async handler(request, h) {
		const { channel } = request.params;
		const { default_unlurk } = request.payload as any;

		if (!db[channel]) {
			throw boom.notFound(`Invalid channel`);
		};

		db[channel].unlurk_default = default_unlurk;

		return h.response().code(200);
	},
};
export default data;