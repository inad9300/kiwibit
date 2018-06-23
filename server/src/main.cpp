#include <arpa/inet.h>
#include <iostream>
#include <stdlib.h>
#include <string>
#include <sys/socket.h>
#include <thread>

#include "logger.cpp"
#include "serve.cpp"

#define PORT 3000

int main() {
    usda::Query::initializePassword();

    int socketFd = socket(AF_INET, SOCK_STREAM, 0);
    if (socketFd < 0) {
        logger::error("Error creating the socket.");
        return 1;
    }

    logger::info("Socket " + std::to_string(socketFd) + " created.");

    static struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = htonl(INADDR_ANY);
    serverAddr.sin_port = htons(PORT);

    int bindOut = bind(socketFd, (struct sockaddr*) &serverAddr, sizeof(serverAddr));
    if (bindOut < 0) {
        logger::error("Error binding the socket to the local address.");
        close(socketFd);
        return 1;
    }

    int listenOut = listen(socketFd, SOMAXCONN);
    if (listenOut < 0) {
        logger::error("Error listening for socket connections.");
        close(socketFd);
        return 1;
    }

    logger::info("Serving in port " + std::to_string(PORT) + "...");

    while (1) {
        int newSocketFd = accept(socketFd, (struct sockaddr*) NULL, NULL);
        if (newSocketFd < 0) {
            logger::error("Error accepting the socket connection.");
            continue;
        }

        std::thread t(serve, newSocketFd);
        t.detach();
    }
}
