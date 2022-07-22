export function formatMessage(message: string, meta: any): string {
	return message
	.replace(/\$\(user\)/, meta.user);
};