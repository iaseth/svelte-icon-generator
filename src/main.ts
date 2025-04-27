#!/usr/bin/env node

import * as fs from 'fs';
import path from 'path';
import { ArgumentParser } from 'argparse';
import { getSvelteFileName } from './utils.js';
import { IconDS, generateSvelteComponent, icons } from './icon.js';



function generateIcons (iconNames: string[], dirpath: string) {
	for (const iconName of iconNames) {
		const icon = icons.find(icon => icon.name === iconName);
		if (icon) {
			const filename = getSvelteFileName(icon.name);
			const filepath = path.join(dirpath, filename);
			const content = generateSvelteComponent(icon.svg);
			fs.writeFileSync(filepath, content);
			console.log(`Generated: '${filepath}'`);
		} else {
			console.log(`Icon not found: '${iconName}'`);
		}
	}
}

function listIcons (iconArr: IconDS[]) {
	for (let i=0; i < iconArr.length; i++) {
		const icon = iconArr[i];
		console.log(`Icon ${i+1} => '${icon.name}'`);
	}
}

function main() {
	const parser = new ArgumentParser({
		description: 'svig - Command-line tool for generating Svelte Icon Components',
	});

	// Define arguments
	parser.add_argument('command', {
		help: 'The command to run'
	});
	parser.add_argument('-o', '--out', {
		help: 'Output directory path',
		metavar: 'DIR',
		default: "src/lib/components/svig"
	});
	parser.add_argument('-s', '--save', {
		action: 'store_true',
		help: 'Save to disk',
		default: false
	});
	const [args, rest] = parser.parse_known_args();

	switch (args.command) {
		case "generate":
			if (rest.length === 0) {
				console.log("Usage: svig generate icon-one icon-two . . .")
				return;
			} else {
				generateIcons(rest, args.out);
			}
			break;

		case 'list':
			listIcons(icons); break;
		default:
			console.log(`Unknown command: '${args.command}'`); return;
	}
}

main()
