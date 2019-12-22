# 1. Build image from Dockerfile
# docker build --tag kiwibitsi .
# docker images --all

# 2. Run image as container
# docker container stop kiwibitsc
# docker container prune
# docker run --name kiwibitsc --env POSTGRES_PASSWORD=hnzygqa2QLrRLxH4MvsOtcVVUWsYvQ7E --detach kiwibitsi
# docker ps --all
# docker logs kiwibitsc

# 3. Execute command inside container
# docker exec --interactive --tty kiwibitsc bash
# docker exec --interactive --tty kiwibitsc psql -U postgres

FROM postgres:12.1-alpine

RUN apk update
RUN apk add --no-cache bash

COPY data/ /docker-entrypoint-initdb.d/data/
COPY schemas/ /docker-entrypoint-initdb.d/schemas/
COPY upgrades/ /docker-entrypoint-initdb.d/upgrades/

COPY init.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/init.sh
