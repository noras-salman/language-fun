FROM node:slim

WORKDIR /app

# COPY content
COPY . /app

# Build frontend
WORKDIR /app/game-app
RUN npm install
RUN npm run build

# Build data
WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 python3-pip  
RUN pip3 install -r requirements.txt
RUN python3 download.py

# Prepare server
WORKDIR /app/server
RUN npm install

