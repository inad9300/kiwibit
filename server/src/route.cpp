#pragma once

#include <string>

#include "HttpStatus.cpp"
#include "reply.cpp"
#include "usda/Query.cpp"
#include "usda/tables.cpp"

static const std::map<std::string, std::string> URL_TO_FOOD_GROUP = {
    {"/spices-and-herbs", "0200"},
    {"/fats-and-oils", "0400"},
    {"/soupes-and-sauces", "0600"},
    {"/breakfast-cereals", "0800"},
    {"/fruits-and-juices", "0900"},
    {"/vegetables", "1100"},
    {"/nuts-and-seeds", "1200"},
    {"/beverages", "1400"},
    {"/legumes", "1600"},
    {"/grains", "2000"}
};

void route(int socketFd, std::string method, const std::string& url, const std::string& body) {
    if (body.length() > 0) {} // TODO Remove.

    if (method == "GET") {
        if (URL_TO_FOOD_GROUP.count(url) > 0) {
            auto foodGroup = URL_TO_FOOD_GROUP.at(url);
            auto q = usda::Query(
                "select ndb_no as id, long_desc from food_des where fdgrp_cd = '" + foodGroup + "' order by long_desc"
            );
            reply(socketFd, HttpStatus::OK, q.getAllAsJson());
        } // else if (url) {}
    }
}
