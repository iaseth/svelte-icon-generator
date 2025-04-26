import requests
from bs4 import BeautifulSoup


def main():
	response = requests.get("https://heroicons.com/")
	soup = BeautifulSoup(response.text, "lxml")

	main = soup.find("main")
	groups = main.find_all('div', class_="group")

	icons = []
	for group in groups:
		svg = group.find("svg")
		if svg:
			icon = {}
			icon['title'] = list(group.children)[-1]['title']
			icon['svg'] = str(svg).strip()
			icons.append(icon)

	for i, icon in enumerate(icons, start=1):
		svg_path = f"svgs/{icon['title']}.svg"
		print(f"{i:4}. '{icon['title']}'")
		with open(svg_path, "w") as f:
			f.write(icon['svg'])
		print(f"\tSaved: {svg_path}")


if __name__ == '__main__':
	main()
