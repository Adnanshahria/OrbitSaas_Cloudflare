import json
import urllib.request
import re

try:
    req = urllib.request.Request('https://www.thesvg.org/', headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        with open('thesvg_page.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Saved html to thesvg_page.html")
except Exception as e:
    print(f"Error: {e}")
