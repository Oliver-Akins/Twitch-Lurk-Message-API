import { ServerRoute } from "@hapi/hapi";
import { db } from "@/main";

const data: ServerRoute = {
	method: `POST`, path: `/login`,
	options: {},
	async handler(request, h) {
		const { access, admin } = request.auth.credentials as { username: string, access: string[]; admin: boolean };

		let channels = access.filter(x => x != "*");
		if (access.includes(`*`)) {
			channels.push(...Object.keys(db).filter(c => !channels.includes(c)));
		};

		return h.response({ admin, channels }).code(200);
	},
};
export default data;