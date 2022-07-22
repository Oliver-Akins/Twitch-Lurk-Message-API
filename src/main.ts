// Filepath alias resolution
import "module-alias/register";

// Begin personal code
import { Server, Request } from "@hapi/hapi";
import basic from "@hapi/basic";
import path from "path";
import glob from "glob";
import toml from "toml";
import fs from "fs";

const isDev = process.env.NODE_ENV?.startsWith(`dev`);

// load the config
if (!fs.existsSync(`config.toml`)) {
	console.log(`Please fill out the config and then try starting the server again.`);
	process.exit(1);
};
export const config: config = toml.parse(fs.readFileSync(`config.toml`, `utf-8`));


// Load the database
if (!fs.existsSync(`data/db.json`)) {
	console.log(`Can't find database file, creating default`);
	fs.writeFileSync(`data/db.json`, `{}`);
};
export var db: database = JSON.parse(fs.readFileSync(`data/db.json`, `utf-8`));


function saveDB() {
	console.log(`Saving database`);
	fs.writeFileSync(`data/db.json`, JSON.stringify(db, null, `\t`));
	process.exit(0);
};

process.on(`SIGINT`, saveDB);
process.on(`SIGTERM`, saveDB);
process.on(`uncaughtException`, saveDB);

async function init() {

	const server = new Server({
		port: config.server.port,
		routes: {
			cors: {
				origin: [
					isDev ? `*` : `oliver.akins.me/Twitch-Lurk-Message-API/`,
				],
				credentials: true,
			},
		},
	});

	await server.register(basic);
	server.auth.strategy(`basic`, `basic`, {
		async validate(request: Request, username: string, password: string) {
			let isValid = false;
			let user: account|undefined;
			for (const account of config.accounts) {
				if (username == account.username) {
					user = account;
					isValid = (
						password == account.password
						&& (
							request.params?.channel == null
							|| account.access.includes(`*`)
							|| account.access.includes(request.params.channel)
						)
					);
					break;
				};
			};

			return { isValid, credentials: { username, access: user?.access } };
		},
	});
	server.auth.default(`basic`);

	// Register all the routes
	let files = glob.sync(
		`endpoints/**/!(*.map)`,
		{ cwd: __dirname, nodir: true}
	);
	for (var file of files) {
		let route = (await import(path.join(__dirname, file))).default;
		console.log(`Registering route: ${route.method} ${route.path}`);
		server.route(route);
	};

	server.start().then(() => {
		console.log(`Server listening on ${config.server.host}:${config.server.port}`);
	});
};

init();