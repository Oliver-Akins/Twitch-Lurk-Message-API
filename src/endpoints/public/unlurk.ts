import { ServerRoute } from "@hapi/hapi";
import { formatMessage } from "@/utils";
import boom from "@hapi/boom";
import { db } from "@/main";
import Joi from "joi";

const data: ServerRoute = {
	method: `GET`, path: `/{channel}/unlurk`,
	options: {
		auth: false,
		validate: {
			params: Joi.object({
				channel: Joi.string().alphanum(),
			}),
			query: Joi.object({
				user: Joi.string(),
			}),
		},
	},
	async handler(request, h) {
		const { channel } = request.params;
		const { user } = request.query;

		if (!db[channel]) {
			throw boom.notFound(`Invalid channel`);
		};

		const messages = db[channel].messages;
		const messageId = db[channel].lurkers[user];

		/*
		Gets the default unlurk message just in case the user doesn't have a
		message group defined.
		*/
		let lurkMessage;
		if (!messageId) {
			lurkMessage = db[channel].unlurk_default;
		} else {
			const message = messages[messageId];
			lurkMessage = message.unlurk[Math.floor(Math.random() * message.unlurk.length)];
			delete db[channel].lurkers[user];
		};


		let twitchMessage = formatMessage(
			lurkMessage,
			{
				user,
				channel,
			}
		);

		return h.response(twitchMessage).code(200);
	},
};
export default data;