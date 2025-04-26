#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

interface Icon {
	title: string,
	svg: string
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsJson = JSON.parse(
	fs.readFileSync(path.join(__dirname, 'icons.json'), 'utf-8')
);

const icons: Icon[] = iconsJson.icons;

function generateSvelteComponent(svgContent: string): string {
	svgContent = svgContent.trim();
	return `
<script lang="ts">
	interface Props {
		size?: number,
		class?: string
	}
	let { size, ...props }: Props = $props();
	let px = \`\${size || 160}px\`;
</script>

<div style:height={px} style:width={px} class={props.class || ""}>
	${svgContent}
</div>
`;
}

function dashedToCamelCase(str: string): string {
	return str
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}

function getSvelteFileName(icon: Icon): string {
	return `${dashedToCamelCase(icon.title)}.svelte`;
}

function main() {
	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.log("Usage: svig icon-one icon-two . . .")
		return;
	}
	
	for (const arg of args) {
		const icon = icons.find(icon => icon.title === arg);
		if (icon) {
			const filename = getSvelteFileName(icon);
			const content = generateSvelteComponent(icon.svg);
			fs.writeFileSync(filename, content);
			console.log(`Generated: '${filename}'`);
		} else {
			console.log(`Icon not found: '${arg}'`);
		}
	}
}

main()
