#!/bin/bash

clear

echo -e "\n> Building image from Dockerfile (verify with \`docker images\`)"
docker build --tag kiwibiti .

echo -e "\n> Stopping and removing previous container"
docker container stop kiwibitc
docker rm kiwibitc

echo -e "\n> Running container (verify with \`docker ps\`; check logs with \`docker logs -f kiwibitc\`; interact with \`docker exec -it kiwibitc psql -U postgres\`)"
docker run \
  --name kiwibitc \
  --env POSTGRES_PASSWORD=hnzygqa2QLrRLxH4MvsOtcVVUWsYvQ7E \
  -p 5000:5432 \
  --detach \
  kiwibiti
