interface account {
	username: string;
	password: string;
	access: string[];
}


interface config {
	server: {
		host: string;
		port: number;
	};
	accounts: account[];
}