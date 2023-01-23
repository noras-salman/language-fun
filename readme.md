# Language Game

This game is a fun and interactive way to learn and practice different languages with a group of friends. The game uses web sockets to allow multiple players to connect and play together in real-time.

The objective of the game is to listen to a sample of a language spoken by a native speaker and be the first to correctly guess the language. Each correct guess earns the player points, and at the end of the game, the player with the most points wins.

To play, simply connect to the game using your web browser and join a game room with your friends. Once the game starts, you will hear a sample of a language and have to quickly type in your guess. The first player to correctly guess the language earns points, and the game continues with another sample.

The game features a wide variety of languages, including popular languages such as Spanish, French, and German, as well as lesser-known languages like Swahili and Tagalog. This allows players to expand their language skills and learn something new.

In addition to being a fun way to learn and practice languages, "Language Guess" also promotes teamwork and friendly competition among friends. So, gather your friends and put your language skills to the test!

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
