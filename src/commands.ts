import { IconDS, deleteSvelteComponentOnDisk, generateMasterComponentOnDisk, generateSvelteComponentOnDisk, icons } from './icon.js';
import { getSvigConfig, saveSvigConfig, svigConfigPath } from './config.js';
import { getSvelteComponentPath } from './utils.js';


export interface CommandProps {
	dirpath: string,
	master: boolean
}


export function addIconsCommand (iconNames: string[], props: CommandProps) {
	const { dirpath, master } = props;
	if (iconNames.length === 0) {
		console.log(`Please provide icons to add!`); return;
	}

	const config = getSvigConfig();
	for (const iconName of iconNames) {
		const icon = icons.find(ic => ic.name === iconName);
		if (icon) {
			if (config.icons.includes(iconName)) {
				console.log(`Icon already added: '${iconName}'`);
				if (!master) {
					generateSvelteComponentOnDisk(icon, dirpath, false);
				}
			} else {
				console.log(`Icon was added: '${iconName}'`);
				config.icons.push(iconName);
				saveSvigConfig(config);

				if (!master) {
					generateSvelteComponentOnDisk(icon, dirpath, true);
				}
			}
		} else {
			console.log(`Icon not found: '${iconName}'`);
		}
	}

	if (master) {
		generateMasterComponentOnDisk(config.icons, dirpath);
	}
}

export function removeIconsCommand (iconNames: string[], props: CommandProps) {
	const { dirpath, master } = props;
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

	if (master) {
		generateMasterComponentOnDisk(config.icons, dirpath);
	}
}

export function generateIconsCommand (props: CommandProps, overwrite: boolean) {
	const { dirpath, master } = props;
	const config = getSvigConfig();
	if (config.icons.length === 0) {
		console.log(`No icons found in config: '${svigConfigPath}'`)
		return;
	}

	if (master) {
		generateMasterComponentOnDisk(config.icons, dirpath);
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
		generateMasterComponentOnDisk(config.icons, dirpath);
	} catch (error) {
		console.log(`\tError: ${error}`);
		console.log(`\tCould not generate: '${outputFilePath}'`);
	}
}
