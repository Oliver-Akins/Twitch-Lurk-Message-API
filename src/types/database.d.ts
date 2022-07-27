interface lurk_message {
	lurk: string[];
	unlurk: string[];
}

interface database {
	[index: string]: {
		unlurk_default: string;
		lurkers: {[index: string]: string}
		messages: {[index: string]: lurk_message}
	};
}