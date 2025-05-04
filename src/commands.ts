import fs from "fs";

import { IconDS, deleteSvelteComponentOnDisk, generateSvelteComponentOnDisk, getTemplate, icons } from './icon.js';
import { getSvigConfig, saveSvigConfig, svigConfigPath } from './config.js';
import { getSvelteComponentPath } from './utils.js';


export interface CommandProps {
	dirpath: string,
}


export function addIconsCommand (iconNames: string[], props: CommandProps) {
	const { dirpath } = props;
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

export function removeIconsCommand (iconNames: string[], props: CommandProps) {
	const { dirpath } = props;
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

export function generateIconsCommand (props: CommandProps, overwrite: boolean) {
	const { dirpath } = props;
	const config = getSvigConfig();
	if (config.icons.length === 0) {
		console.log(`No icons found in config: '${svigConfigPath}'`)
		return;
	}

	console.log(`Generating ${config.icons.length} component(s) . . .`)
	for (const iconName of config.icons) {
		const icon = icons.find(icon => icon.name === iconName);
		if (icon) {
			generateSvelteComponentOnDisk(icon, dirpath, overwrite);
		} else {
			console.log(`\tIcon not found: '${iconName}'`);
		}
	}
}

export function listIconsCommand (iconArr: IconDS[]) {
	for (let i=0; i < iconArr.length; i++) {
		const icon = iconArr[i];
		console.log(`Icon ${i+1} => '${icon.name}'`);
	}
}

export function generateMasterComponentCommand (props: CommandProps, overwrite: boolean) {
	const { dirpath } = props;
	const outputFilePath = getSvelteComponentPath("", dirpath);

	try {
		const config = getSvigConfig();
		const masterTemplate = getTemplate("SvelteMasterComponent.hbs");

		const currentIcons = config.icons.map(name => icons.find(i => i.name === name));
		const nametype = config.icons.map(i => `"${i}"`).join(" | ");
		const firstIcon = currentIcons[0];
		const restIcons = currentIcons.slice(1);
		const unknownIcon = icons.find(i => i.name === "question-mark-circle");

		const renderedCode = masterTemplate({
			nametype, firstIcon, restIcons, unknownIcon
		});
		fs.writeFileSync(outputFilePath, renderedCode);
		console.log(`\tGenerated: '${outputFilePath}'`);
	} catch (error) {
		console.log(`\tError: ${error}`);
		console.log(`\tCould not generate: '${outputFilePath}'`);
	}
}
