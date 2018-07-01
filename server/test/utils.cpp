#include <cassert>
#include "../src/utils.cpp"

int main() {
    std::string input = "initial! string!";
    replace_string(input, "!", "");
    assert(input == "initial string");
}
