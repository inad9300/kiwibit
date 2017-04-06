#pragma once

#include "usda.cpp"
#include "utils.cpp"

namespace seq {

    void run() {
        auto rda = usda::rda();
        auto ul = usda::ul();
        assert(rda.size() == ul.size());

        auto food = usda::food_data();
        auto food_ids = usda::food_ids();
        auto food_names = usda::food_names();
        auto food_max = usda::food_max(food, ul);

        
    }
}