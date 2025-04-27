#!/usr/bin/env node

import * as fs from 'fs';
import { getSvelteFileName } from './utils';
import { generateSvelteComponent, icons } from './icon';



function main() {
	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.log("Usage: svig icon-one icon-two . . .")
		return;
	}
	
	for (const arg of args) {
		const icon = icons.find(icon => icon.title === arg);
		if (icon) {
			const filename = getSvelteFileName(icon.title);
			const content = generateSvelteComponent(icon.svg);
			fs.writeFileSync(filename, content);
			console.log(`Generated: '${filename}'`);
		} else {
			console.log(`Icon not found: '${arg}'`);
		}
	}
}

main()
