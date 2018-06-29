#pragma once

#include <regex>
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

static void addFieldToJson(std::string& json, const std::string& fieldName, const std::string& fieldValue) {
    json.pop_back();
    json += ",\"" + fieldName + "\":" + fieldValue + "}";
}

static const std::regex foods_id("/foods/([0-9]+)");
static const std::regex nutrients_id_foods("/nutrients/([0-9]+)/foods");

bool route(int socketFd, std::string method, const std::string& url, const std::string& body) {
    if (body.length() > 0) {} // TODO Remove.

    std::smatch matches;

    if (method == "GET") {
        if (url == "/") {
            std::vector<std::string> headers{"Location: /app/food-details.html"};
            reply(socketFd, headers, HttpStatus::Found);
            return true;
        }
        else if (URL_TO_FOOD_GROUP.count(url) > 0) {
            auto foodGroup = URL_TO_FOOD_GROUP.at(url);
            auto q = usda::Query(
                "select ndb_no, long_desc"
                " from food_des"
                " where fdgrp_cd = '" + foodGroup + "'"
                " order by long_desc"
            );
            reply(socketFd, HttpStatus::OK, q.getAllAsJson());
            return true;
        }
        else if (std::regex_search(url, matches, foods_id)) {
            auto id = matches[1].str();

            auto details = usda::Query(
                "select fg.fdgrp_desc, fd.long_desc, fd.comname, fd.manufacname, fd.sciname, fd.refuse, fd.ref_desc"
                " from food_des fd"
                " join fd_group fg on (fg.fdgrp_cd = fd.fdgrp_cd)"
                " where fd.ndb_no = '" + id + "'"
            );
            auto nutrition = usda::Query(
                "select ndf.nutrdesc, ndf.units, nd.nutr_val, nd.min, nd.max, nd.add_nutr_mark"
                " from food_des fd"
                " join nut_data nd on (nd.ndb_no = fd.ndb_no)"
                " join nutr_def ndf on (ndf.nutr_no = nd.nutr_no)"
                " where fd.ndb_no = '" + id + "'"
                " order by ndf.nutrdesc"
            );
            auto sources = usda::Query(
                "select distinct ds.journal, ds.title, ds.authors, ds.year"
                " from food_des fd"
                " join datsrcln dsl on (dsl.ndb_no = fd.ndb_no)"
                " join data_src ds on (ds.datasrc_id = dsl.datasrc_id)"
                " where fd.ndb_no = '" + id + "'"
                " order by ds.year desc"
            );

            auto json = details.getNextAsJson();
            addFieldToJson(json, "nutrition", nutrition.getAllAsJson());
            addFieldToJson(json, "sources", sources.getAllAsJson());

            reply(socketFd, HttpStatus::OK, json);
            return true;
        }
        else if (url == "/nutrients") {
            auto nutrients = usda::Query(
                "select ndf.nutr_no, ndf.units, ndf.nutrdesc"
                " from nutr_def ndf"
                " order by ndf.nutrdesc"
            );

            reply(socketFd, HttpStatus::OK, nutrients.getAllAsJson());
            return true;
        }
        else if (std::regex_search(url, matches, nutrients_id_foods)) {
            auto id = matches[1].str();

            auto foods = usda::Query(
                "select fd.long_desc, nd.nutr_val, fg.fdgrp_desc, fg.fdgrp_cd"
                " from food_des fd"
                " join nut_data nd on (nd.ndb_no = fd.ndb_no)"
                " join fd_group fg on (fg.fdgrp_cd = fd.fdgrp_cd)"
                " where nd.nutr_no = '" + id + "'"
                " and fd.fdgrp_cd in (0200, 0400, 0600, 0800, 0900, 1100, 1200, 1400, 1600, 2000)"
                " order by nd.nutr_val desc"
                " limit 50"
            );

            reply(socketFd, HttpStatus::OK, foods.getAllAsJson());
            return true;
        }
    }

    return false;
}
