#!/usr/bin/env node

import { ArgumentParser } from 'argparse';
import { IconDS, deleteSvelteComponentOnDisk, generateSvelteComponentOnDisk, icons } from './icon.js';
import { getSvigConfig, saveSvigConfig, svigConfigPath } from './config.js';



function addIconsCommand (iconNames: string[], dirpath: string) {
	if (iconNames.length === 0) {
		console.log(`Please provide icons to add!`); return;
	}

	const config = getSvigConfig();
	for (const iconName of iconNames) {
		const icon = icons.find(ic => ic.name === iconName);
		if (icon) {
			if (config.icons.includes(iconName)) {
				console.log(`Icon already added: '${iconName}'`);
				generateSvelteComponentOnDisk(icon, dirpath, false);
			} else {
				console.log(`Icon was added: '${iconName}'`);
				config.icons.push(iconName);
				saveSvigConfig(config);
				generateSvelteComponentOnDisk(icon, dirpath, true);
			}
		} else {
			console.log(`Icon not found: '${iconName}'`);
		}
	}
}

function removeIconsCommand (iconNames: string[], dirpath: string) {
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
		deleteSvelteComponentOnDisk(iconName, dirpath);
	}
}

function generateIconsCommand (dirpath: string) {
	const config = getSvigConfig();
	if (config.icons.length === 0) {
		console.log(`No icond found in config: '${svigConfigPath}'`)
		return;
	}

	console.log(`Generating ${config.icons.length} component(s) . . .`)
	for (const iconName of config.icons) {
		const icon = icons.find(icon => icon.name === iconName);
		if (icon) {
			generateSvelteComponentOnDisk(icon, dirpath, true);
		} else {
			console.log(`\tIcon not found: '${iconName}'`);
		}
	}
}

function listIconsCommand (iconArr: IconDS[]) {
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
		case "add":
		case "a":
			addIconsCommand(rest, args.out); break;

		case "remove":
		case "rm":
		case "r":
			removeIconsCommand(rest, args.out); break;

		case "generate":
		case "gen":
		case "g":
			generateIconsCommand(args.out); break;

		case 'list':
		case 'l':
			listIconsCommand(icons); break;

		default:
			console.log(`Unknown command: '${args.command}'`); return;
	}
}

main()
