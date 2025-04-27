#!/usr/bin/env node

import { ArgumentParser } from 'argparse';
import { icons } from './icon.js';
import { addIconsCommand, removeIconsCommand, generateIconsCommand, listIconsCommand } from './commands.js';



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
