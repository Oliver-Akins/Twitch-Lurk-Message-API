interface lurk_message {
	lurk: string[];
	unlurk: string[];
}

interface database {
	[index: string]: {
		lurkers: {[index: string]: string}
		messages: {[index: string]: lurk_message}
	};
}