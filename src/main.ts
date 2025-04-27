#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { ArgumentParser } from 'argparse';
import { getSvelteFileName } from './utils.js';
import { IconDS, generateSvelteComponent, icons } from './icon.js';
import { getSvigConfig, saveSvigConfig, svigConfigPath } from './config.js';



function addIcons (iconNames: string[], dirpath: string) {
	if (iconNames.length === 0) {
		console.log(`Please provide icons to add!`); return;
	}

	const config = getSvigConfig();
	for (const iconName of iconNames) {
		const icon = icons.find(ic => ic.name === iconName);
		if (icon) {
			if (config.icons.includes(iconName)) {
				console.log(`Icon already added: '${iconName}'`);
			} else {
				console.log(`Icon was added: '${iconName}'`);
				config.icons.push(iconName);
				saveSvigConfig(config);
			}
		} else {
			console.log(`Icon not found: '${iconName}'`);
		}
	}
}

function removeIcons (iconNames: string[], dirpath: string) {
	if (iconNames.length === 0) {
		console.log(`Please provide icons to remove!`); return;
	}

	const config = getSvigConfig();
	if (!config.icons || config.icons.length === 0) {
		console.log(`No icons found in config: '${svigConfigPath}'`);
		return;
	}

	for (const iconName of iconNames) {
		if (config.icons.includes(iconName)) {
			config.icons = config.icons.filter(ic => ic !== iconName);
			saveSvigConfig(config);
			console.log(`Icon was removed: '${iconName}'`);
		} else {
			console.log(`Icon not present in config: '${iconName}'`);
		}
	}
}

function generateIcons (iconNames: string[], dirpath: string) {
	if (iconNames.length === 0) {
		console.log("Usage: svig generate icon-one icon-two . . .")
		return;
	}

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
		case "add": addIcons(rest, args.out); break;
		case "rm": removeIcons(rest, args.out); break;
		case "generate": generateIcons(rest, args.out); break;
		case 'list': listIcons(icons); break;
		default:
			console.log(`Unknown command: '${args.command}'`); return;
	}
}

main()
