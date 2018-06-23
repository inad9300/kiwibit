#pragma once

#include <map>
#include <string>
#include <unistd.h>

#include "HttpStatus.cpp"
#include "logger.cpp"

static const std::map<HttpStatus, std::string> HTTP_STATUS_CODE_TO_TEXT = {
    {HttpStatus::OK, "OK"},
    {HttpStatus::BadRequest, "Bad Request"},
    {HttpStatus::NotFound, "Not Found"},
    {HttpStatus::InternalServerError, "Internal Server Error"}
};

void reply(int socketFd, HttpStatus httpStatus) {
    const std::string response =
        "HTTP/1.1 " + std::to_string(httpStatus) + " " + HTTP_STATUS_CODE_TO_TEXT.at(httpStatus) + "\r\n"
        "Content-Length: 0\r\n"
        "\r\n";

    int writeOut = write(socketFd, response.c_str(), response.length());
    if (writeOut < 0) {
        logger::error("Error writing to socket " + std::to_string(socketFd) + ".");
    }

    close(socketFd);
}

void reply(int socketFd, HttpStatus httpStatus, const std::string& body) {
    const std::string response =
        "HTTP/1.1 " + std::to_string(httpStatus) + " " + HTTP_STATUS_CODE_TO_TEXT.at(httpStatus) + "\r\n"
        "Content-Length: " + std::to_string(body.length()) + "\r\n"
        "Content-Type: application/json; charset=utf-8\r\n"
        "\r\n" + body;

    logger::info("Sending HTTP " + std::to_string(httpStatus) + " response... " + body.substr(0, 512));

    int writeOut = write(socketFd, response.c_str(), response.length());
    if (writeOut < 0) {
        logger::error("Error writing to socket " + std::to_string(socketFd) + ".");
    }

    close(socketFd);
}

void errply(int socketFd, HttpStatus httpStatus, const std::string& msg) {
    reply(socketFd, httpStatus, "{\"error\": \"" + msg + "\"}");
}
