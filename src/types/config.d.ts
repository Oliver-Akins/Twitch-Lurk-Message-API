interface account {
	username: string;
	password: string;
	admin: boolean;
	access: string[];
}


interface config {
	server: {
		host: string;
		port: number;
	};
	accounts: account[];
}