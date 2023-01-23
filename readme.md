# Language Game

## Run with docker

```bash
docker-compose up
```

Go to http://localhost:8080

## Run locally

### download data

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python download.py
```

### run server

```bash
cd server
npm install
node server.js
```

### Build or run front-end

```bash
cd game-app
npm install
# run in development mode
npm run start

# run production mode (served from the server)
npm run build
```

Go to http://localhost:8080
