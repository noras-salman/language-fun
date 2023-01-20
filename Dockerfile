FROM node:slim

WORKDIR /app

COPY . /app
RUN apt-get update && apt-get install -y \
    python3 python3-pip  
RUN pip3 install -r requirements.txt
RUN python3 download.py
RUN npm install

