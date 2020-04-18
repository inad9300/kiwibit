FROM postgres:12.2-alpine

RUN apk update
RUN apk add --no-cache bash

COPY data/ /docker-entrypoint-initdb.d/data/
COPY schemas/ /docker-entrypoint-initdb.d/schemas/
COPY upgrades/ /docker-entrypoint-initdb.d/upgrades/

COPY init.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/init.sh
