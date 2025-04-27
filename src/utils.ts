


function dashedToCamelCase(str: string): string {
	return str
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}

export function getSvelteFileName(title: string): string {
	return `${dashedToCamelCase(title)}.svelte`;
}
