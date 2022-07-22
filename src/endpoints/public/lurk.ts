import { ServerRoute } from "@hapi/hapi";
import { formatMessage } from "@/utils";
import boom from "@hapi/boom";
import { db } from "@/main";
import Joi from "joi";

const data: ServerRoute = {
	method: `GET`, path: `/{channel}/lurk`,
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
		const messageIds = Object.keys(messages);
		const messageId = messageIds[Math.floor(Math.random() * messageIds.length)];
		const message = messages[messageId];
		let lurkMessage = message.lurk[Math.floor(Math.random() * message.lurk.length)];

		db[channel].lurkers[user] = messageId;

		let twitchMessage = formatMessage(
			lurkMessage,
			{
				user,
			}
		);

		return h.response(twitchMessage).code(200);
	},
};
export default data;