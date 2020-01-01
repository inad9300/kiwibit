# 1. Build image from Dockerfile
# docker build --tag kiwibiti .
# docker images --all

# 2. Run image as container
# docker container stop kiwibitc
# docker container prune
# docker run --name kiwibitc --env POSTGRES_PASSWORD=hnzygqa2QLrRLxH4MvsOtcVVUWsYvQ7E --detach kiwibiti
# docker ps --all
# docker logs kiwibitc

# 3. Execute command inside container
# docker exec --interactive --tty kiwibitc bash
# docker exec --interactive --tty kiwibitc psql -U postgres

FROM postgres:12.1-alpine

RUN apk update
RUN apk add --no-cache bash

COPY data/ /docker-entrypoint-initdb.d/data/
COPY schemas/ /docker-entrypoint-initdb.d/schemas/
COPY upgrades/ /docker-entrypoint-initdb.d/upgrades/

COPY init.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/init.sh
