FROM postgres:12.2-alpine

RUN apk update
RUN apk add --no-cache bash

ARG DIR=/docker-entrypoint-initdb.d

COPY schemas/ $DIR/schemas/
COPY upgrades/ $DIR/upgrades/
COPY datasets/usda_sample/ $DIR/datasets/usda/

COPY init.sh $DIR/
RUN chmod +x $DIR/init.sh
