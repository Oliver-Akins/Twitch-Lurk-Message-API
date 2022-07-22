import { ServerRoute } from "@hapi/hapi";
import boom from "@hapi/boom";
import { db } from "@/main";
import Joi from "joi";

const data: ServerRoute = {
	method: `DELETE`, path: `/manage/{channel}/lurkers`,
	options: {
		validate: {
			params: Joi.object({
				channel: Joi.string().alphanum(),
			}),
		},
	},
	async handler(request, h) {
		const { channel } = request.params;

		if (!db[channel]) {
			throw boom.notFound(`Invalid channel`);
		};

		db[channel].lurkers = {};

		return h.response().code(200);
	},
};
export default data;