#pragma once

#include <fcntl.h>
#include <map>
#include <string>
#include <sys/sendfile.h>
#include <sys/stat.h>
#include <unistd.h>

#include "HttpStatus.cpp"
#include "logger.cpp"
#include "reply.cpp"

static const std::map<std::string, std::string> EXT_TO_MIME_TYPE = {
    {"txt", "text/plain"},
    {"css", "text/css"},
    {"html", "text/html"},
    {"js", "application/javascript"},
    {"json", "application/json"},
    {"csv", "text/csv"},
    {"gif", "image/gif"},
    {"png", "image/png"},
    {"jpg", "image/jpeg"},
    {"jpeg", "image/jpeg"}
};

void serveFile(int socketFd, const std::string& path) {
    if (path[0] != '/') {
        errply(socketFd, HttpStatus::BadRequest, "Unsupported path.");
        return;
    }

    std::string fileExtension = path.substr(path.find_last_of('.') + 1);
    if (EXT_TO_MIME_TYPE.count(fileExtension) == 0) {
        errply(socketFd, HttpStatus::BadRequest, "Unsupported file extension.");
        return;
    }
    std::string mimeType = EXT_TO_MIME_TYPE.at(fileExtension);

    int fileFd = open(("../static" + path).c_str(), O_RDONLY);
    if (fileFd < 0) {
        errply(socketFd, HttpStatus::InternalServerError, "Could not open requested file.");
        return;
    }

    struct stat statBuff;
    fstat(fileFd, &statBuff);

    std::string headers =
        "HTTP/1.1 200 OK\r\n"
        "Content-Length: " + std::to_string(statBuff.st_size) + "\r\n"
        "Content-Type: " + mimeType + "\r\n"
        "\r\n";

    int writeOut = write(socketFd, headers.c_str(), headers.length());
    if (writeOut < 0) {
        errply(socketFd, HttpStatus::InternalServerError, "Error writing HTTP headers.");
    } else {
        writeOut = sendfile(socketFd, fileFd, NULL, statBuff.st_size);
        if (writeOut < 0) {
            errply(socketFd, HttpStatus::InternalServerError, "Error sending file.");
        }
    }

    close(socketFd);
    close(fileFd);
}
