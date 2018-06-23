#pragma once

#include <cassert>
#include <cppconn/connection.h>
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <string>
#include <vector>
#include <unistd.h>

#include "../logger.cpp"

namespace usda {

class Query {

public:
    explicit Query(const std::string& query) {
        try {
            auto driver = get_driver_instance();
            // IDEA Connection pool.
            this->conn = driver->connect("tcp://127.0.0.1:3306", "root", Query::pwd);
            this->conn->setSchema("usdanlsr28");

            this->stmt = this->conn->createStatement();
            this->res = this->stmt->executeQuery(query);
        } catch (sql::SQLException& e) {
            logger::error(
                "SQL exception: " + std::string(e.what())
                + "\nSQL state: " + std::string(e.getSQLState())
            );
            // TODO Capture in the parent and transform into HTTP response.
            throw;
        }
    }

    ~Query() {
        delete this->res;
        delete this->stmt;
        delete this->conn;
    }

    std::string getAllAsJson() {
        auto meta = this->res->getMetaData();
        int colCount = meta->getColumnCount();
        assert(colCount > 0);

        std::string json = "[";

        while (res->next()) {
            json += "{";
            for (int i = 1; i <= colCount; ++i) {
                json += "\"" + meta->getColumnLabel(i) + "\":";

                auto colType = meta->getColumnType(i);
                if (colType == sql::DataType::DECIMAL) {
                    json += res->getString(i);
                } else if (colType == sql::DataType::CHAR && meta->getPrecision(i) == 1) {
                    json += res->getString(i) == "Y" ? "true" : "false";
                } else {
                    json += "\"" + res->getString(i) + "\"";
                }
                json += ",";
            }
            json.pop_back();
            json += "},";
        }
        if (this->res->rowsCount() > 0) {
            json.pop_back();
        }

        return json + "]";
    }

    auto next() {
        return this->res->next();
    }

    auto getInt(const std::string& col) {
        return this->res->getInt(col);
    }

    auto getDouble(const std::string& col) {
        return this->res->getDouble(col);
    }

    auto getString(const std::string& col) {
        return this->res->getString(col);
    }

    bool getBool(const std::string& col) {
        return this->res->getBoolean(col);
    }

    // IDEA getDate().

    // NOTE Must be called before the class is used.
    static void initializePassword() {
        auto pwd = getpass("Database password: "); // FIXME getpass() is obsolete.
        usda::Query::pwd = std::string(pwd);

        auto q = usda::Query("select version() as v");
        if (q.next()) {
            logger::info("Connected to USDA database. " + std::string(q.getString("v")));
        }
    }

private:
    static std::string pwd;

    sql::Connection* conn;
    sql::Statement* stmt;
    sql::ResultSet* res;
};

}

std::string usda::Query::pwd = "";
