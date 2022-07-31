import { ServerRoute } from "@hapi/hapi";
import { db } from "@/main";

const data: ServerRoute = {
	method: `POST`, path: `/login`,
	async handler(request, h) {
		const { access } = request.auth.credentials as { username: string, access: string[] };

		let channels = access.filter(x => x != "*");
		if (access.includes(`*`)) {
			channels.push(...Object.keys(db).filter(c => !channels.includes(c)));
		};

		return h.response(channels).code(200);
	},
};
export default data;