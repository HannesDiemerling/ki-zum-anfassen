"""Prüft die statische Seite vor dem Veröffentlichen: Existieren alle lokal verlinkten Dateien?

Aufruf: python3 tools/check_site.py site
"""

import sys
from html.parser import HTMLParser
from pathlib import Path


class LinkCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("href", "src") and value:
                self.links.append(value)


def main(root: Path) -> int:
    errors = []
    pages = sorted(root.glob("*.html"))
    for page in pages:
        parser = LinkCollector()
        parser.feed(page.read_text(encoding="utf-8"))
        for link in parser.links:
            if link.startswith(("http://", "https://", "mailto:", "#", "data:")):
                continue
            target = (page.parent / link.split("#")[0].split("?")[0]).resolve()
            if not target.exists():
                errors.append(f"{page.name}: Link-Ziel fehlt: {link}")
    print(f"{len(pages)} Seiten geprüft.")
    for e in errors:
        print("FEHLER:", e)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(Path(sys.argv[1] if len(sys.argv) > 1 else "site")))
