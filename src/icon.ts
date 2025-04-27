import Handlebars from "handlebars";
import { readFile } from "./fsutils.js";



export interface IconDS {
	name: string,
	svg: string
}

const iconsJson = JSON.parse(readFile('data/icons.json'));

export const icons: IconDS[] = iconsJson.icons;

export function generateSvelteComponent(svgContent: string): string {
	const templateSrc = readFile('templates/SvelteComponent.hbs');
	const template = Handlebars.compile(templateSrc);
	return template({ svgContent });
}
