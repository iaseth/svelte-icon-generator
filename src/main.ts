#!/usr/bin/env node

import { ArgumentParser } from 'argparse';
import { icons } from './icon.js';
import { addIconsCommand, removeIconsCommand, generateIconsCommand, listIconsCommand, generateMasterComponentCommand, CommandProps } from './commands.js';



function main() {
	const parser = new ArgumentParser({
		description: 'svig - Command-line tool for generating Svelte Icon Components',
	});

	// Define arguments
	parser.add_argument('command', {
		help: 'The command to run'
	});
	parser.add_argument('-d', '--dirpath', {
		help: 'Output directory path',
		metavar: 'DIRPATH',
		default: "src/lib/components/svig"
	});
	parser.add_argument('-m', '--master', {
		action: 'store_true',
		help: 'Generate a single SvigIcon component',
		default: false
	});
	const [args, rest] = parser.parse_known_args();

	const props: CommandProps = {
		dirpath: args.dirpath,
		master: args.master
	};

	switch (args.command) {
		case "add":
		case "a":
			addIconsCommand(rest, props); break;

		case "remove":
		case "rm":
		case "r":
			removeIconsCommand(rest, props); break;

		case "create":
		case "c":
			generateIconsCommand(props, false); break;

		case "generate":
		case "gen":
		case "g":
			generateIconsCommand(props, true); break;

		case "master":
		case "m":
			generateMasterComponentCommand(props, true); break;

		case 'list':
		case 'l':
			listIconsCommand(icons); break;

		default:
			console.log(`Unknown command: '${args.command}'`); return;
	}
}

main()
