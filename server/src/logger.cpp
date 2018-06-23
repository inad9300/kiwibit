#pragma once

#include <cerrno>
#include <cstring>
#include <iostream>

namespace logger {

    void debug(std::string msg) {
        std::cout << msg << '\n';
    }

    void info(std::string msg) {
        std::cout << msg << '\n';
    }

    void warn(std::string msg) {
        std::cout << msg << '\n';
    }

    void error(std::string msg) {
        std::cout << msg << ' ' << std::strerror(errno) << '\n';
    }
}
