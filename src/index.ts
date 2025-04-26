#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

interface Icon {
	title: string,
	svg: string
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsJson = JSON.parse(
	fs.readFileSync(path.join(__dirname, 'icons.json'), 'utf-8')
);

const icons: Icon[] = iconsJson.icons;

for (const icon of icons) {
	console.log(`${icon.title} (${icon.svg.length}b)`);
}
