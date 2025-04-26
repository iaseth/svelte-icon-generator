import json

import requests
from bs4 import BeautifulSoup



session = requests.session()

ATTRS_TO_KEEP = [
	'xmlns', 'fill', 'viewbox', 'stroke-width', 'stroke',
	# 'class', 'aria-hidden', 'data-slot'
]


def svg_tag_to_src(svg):
	for attr in list(svg.attrs):
		if attr not in ATTRS_TO_KEEP:
			del svg[attr]

	src = str(svg).strip()
	lines = [line.strip() for line in src.split("\n") if line.strip()]
	src = "".join(lines)
	return src


def get_icons(url, prefix=None):
	response = session.get(url)
	soup = BeautifulSoup(response.text, "lxml")

	main = soup.find("main")
	groups = main.find_all('div', class_="group")

	icons = []
	for group in groups:
		svg = group.find("svg")
		if svg:
			icon = {}
			title = list(group.children)[-1]['title']
			icon['title'] = f"{prefix}-{title}" if prefix else title
			icon['svg'] = svg_tag_to_src(svg)
			icons.append(icon)

	icons.sort(key=lambda x:x['title'])
	return icons


def main():
	icons = [
		*get_icons("https://heroicons.com/"),
		*get_icons("https://heroicons.com/solid", prefix="solid"),
		*get_icons("https://heroicons.com/mini", prefix="mini"),
		*get_icons("https://heroicons.com/micro", prefix="micro"),
	]
	print(f"Found {len(icons)} icons")

	for i, icon in enumerate(icons, start=1):
		svg_path = f"svgs/{icon['title']}.svg"
		print(f"{i:4}. '{icon['title']}'")
		with open(svg_path, "w") as f:
			f.write(icon['svg'])
		print(f"\tSaved: {svg_path}")

	output_json_path = "src/icons.json"
	jo = {}
	jo['icons'] = icons
	with open(output_json_path, "w") as f:
		json.dump(jo, f, sort_keys=True)
	print(f"Saved: {output_json_path} ({len(icons)} icons)")


if __name__ == '__main__':
	main()
