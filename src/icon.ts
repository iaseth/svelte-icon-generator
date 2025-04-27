import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';



export interface Icon {
	title: string,
	svg: string
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsJson = JSON.parse(
	fs.readFileSync(path.join(__dirname, 'icons.json'), 'utf-8')
);

export const icons: Icon[] = iconsJson.icons;

export function generateSvelteComponent(svgContent: string): string {
	svgContent = svgContent.trim();
	return `
<script lang="ts">
	interface Props {
		size?: number,
		class?: string
	}
	let { size, ...props }: Props = $props();
	let px = \`\${size || 160}px\`;
</script>

<div style:height={px} style:width={px} class={props.class || ""}>
	${svgContent}
</div>
`;
}
