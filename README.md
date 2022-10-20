# Cori

## Getting Started

```sh
nvm use v16.17.0
npm install 
cp .env.example .env
# 填写一下 .env
#
# botToken: bot token
# clientId: bot ID
# notionKey: notion api key
# materialTable: card database
# relationTable: author database
#
npm start
```
## Build a nodejs image and share to the Docker Hub

```sh
sudo docker image build -t 'cori' .
sudo docker tag cori <your name>/cori
sudo docker push <your name>/cori
```