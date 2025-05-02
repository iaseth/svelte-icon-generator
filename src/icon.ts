import fs from "fs";
import Handlebars from "handlebars";
import { readFile } from "./fsutils.js";
import { getSvelteComponentPath } from "./utils.js";



export interface IconDS {
	name: string,
	svg: string
}

const iconsJson = JSON.parse(readFile('data/icons.json'));
export const icons: IconDS[] = iconsJson.icons;

let cachedTemplate: HandlebarsTemplateDelegate|null = null;

export function getTemplate (filename: string) {
	const templateSrc = readFile(`templates/${filename}`);
	const template = Handlebars.compile(templateSrc);
	return template;
}

export function generateSvelteComponent(svgContent: string): string {
	if (cachedTemplate === null) {
		cachedTemplate = getTemplate("SvelteComponent.hbs");
	}
	return cachedTemplate({ svgContent });
}

export function generateSvelteComponentOnDisk(icon: IconDS, dirpath: string, overwrite: boolean = false) {
	const filepath = getSvelteComponentPath(icon.name, dirpath);
	if (!overwrite && fs.existsSync(filepath)) {
		console.log(`\tExists: '${filepath}'`);
		return;
	}

	try {
		const content = generateSvelteComponent(icon.svg);
		fs.writeFileSync(filepath, content);
		console.log(`\tGenerated: '${filepath}'`);
	} catch (error) {
		console.log(`\tError: ${error}`);
		console.log(`\tCould not generate: '${filepath}'`);
	}
}

export function deleteSvelteComponentOnDisk(iconName: string, dirpath: string) {
	const filepath = getSvelteComponentPath(iconName, dirpath);
	if (fs.existsSync(filepath)) {
		try {
			fs.unlinkSync(filepath);
			console.log(`\tDeleted: '${filepath}'`);
		} catch (error) {
			console.log(`\tCould not delete: '${filepath}'`);
		}
	} else {
		console.log(`\tNot found: '${filepath}'`);
	}
}
