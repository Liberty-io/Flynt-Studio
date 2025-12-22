import requests
import sys

urls = [
    'http://localhost:3000/',
    'http://localhost:3000/src/main.tsx',
    'http://localhost:3000/src/App.tsx',
]

for u in urls:
    try:
        r = requests.get(u, timeout=5)
        print('URL:', u)
        print('STATUS:', r.status_code)
        print('CT:', r.headers.get('content-type'))
        print('--- BODY PREVIEW ---')
        print(r.text[:1200])
        print('--- END ---\n')
    except Exception as e:
        print('URL:', u, 'ERROR:', e)
        print('\n')

sys.exit(0)
