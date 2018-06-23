#pragma once

#include <string>

#include "HttpStatus.cpp"
#include "logger.cpp"
#include "serveFile.cpp"
#include "reply.cpp"
#include "route.cpp"

void serve(int socketFd) {
    logger::info("Processing socket " + std::to_string(socketFd) + ".");

    static const int BUFF_SIZE = 32768;
    char reqBuff[BUFF_SIZE];

    int reqSize = read(socketFd, reqBuff, BUFF_SIZE);
    if (reqSize < 0) {
        errply(socketFd, HttpStatus::InternalServerError, "Error reading from socket " + std::to_string(socketFd) + ".");
        return;
    }
    std::string reqContent(reqBuff);
    while (reqSize == BUFF_SIZE) {
        reqSize = read(socketFd, reqBuff, BUFF_SIZE);
        if (reqSize < 0) {
            errply(socketFd, HttpStatus::InternalServerError, "Error reading from socket " + std::to_string(socketFd) + ".");
            return;
        }
        reqContent += std::string(reqBuff).substr(0, reqSize);
    }

    auto fstSpaceIdx = reqContent.find(' ', 3);
    if (fstSpaceIdx == std::string::npos) {
        errply(socketFd, HttpStatus::BadRequest, "Invalid HTTP request: no space found after HTTP method.");
        return;
    }
    std::string method = reqContent.substr(0, fstSpaceIdx);

    auto sndSpaceIdx = reqContent.find(' ', fstSpaceIdx + 2);
    if (sndSpaceIdx == std::string::npos) {
        errply(socketFd, HttpStatus::BadRequest, "Invalid HTTP request: no space found after URL.");
        return;
    }
    std::string url = reqContent.substr(fstSpaceIdx + 1, sndSpaceIdx - method.length() - 1);

    if (url.find('.') != std::string::npos) {
        logger::info("Serving file \"" + url + "\".");
        serveFile(socketFd, url);
    } else {
        logger::info("Serving URL \"" + url + "\".");

        auto bodyStartIdx = reqContent.find("\r\n\r\n", sndSpaceIdx);
        std::string reqBody = bodyStartIdx == std::string::npos
            ? ""
            : reqContent.substr(bodyStartIdx);

        if (reqBody.length() > 0 && reqBody != "\r\n\r\n") {
            logger::info("Request body: " + reqBody);
        }
        route(socketFd, method, url, reqBody);
        errply(socketFd, HttpStatus::NotFound, "There is no handler for the route requested.");
    }
}
