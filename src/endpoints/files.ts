import { ServerRoute } from "@hapi/hapi";

const data: ServerRoute = {
	method: `GET`, path: `/{path*}`,
	options: {
		auth: false,
	},
	handler: {
		directory: {
			path: `.`,
			index: true,
			redirectToSlash: true,
			defaultExtension: `html`,
		},
	},
};
export default data;