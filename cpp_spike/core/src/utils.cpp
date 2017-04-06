#pragma once

#include <cmath>
#include <vector>
#include <iostream>

#include "usda.cpp"

namespace utils {

    /**
     *
     */
    auto scalar_by_vector(double scalar, std::vector<double> vector) {
        auto result = vector;

        for (auto& elem : result)
            elem *= scalar;

        return result;
    }

    /**
     *
     */
    auto add_vectors(std::vector<double> a, std::vector<double> b) {
        auto result = a;

        for (auto i = 0; i < result.size(); ++i)
            result[i] += b[i];

        return result;
    }

    /**
     * Calculate the root-mean-square deviation (RMSD) of a given food with respect to the recommended nutritional
     * values.
     */
    auto deviation(const usda::food_t& food, const usda::rda_t& rda) {
        assert(food.size() == rda.size());
        double result = 0;

        for (auto nutr_idx = 0; nutr_idx < food.size(); ++nutr_idx)
            result += std::pow(food[nutr_idx] - rda[nutr_idx], 2);

        return std::sqrt(result / food.size());
    }

    /**
     * Calculate the fitness value (based on the RMSD) for a food combination as a measure of how good it is.
     */
    auto fitness(const std::vector<double> food_combination, const usda::food_arr_t& food, const usda::rda_t& rda) {
        auto super_food = scalar_by_vector(food_combination[0], food[0]);

        for (auto food_idx = 1; food_idx < food_combination.size(); ++food_idx)
            super_food = add_vectors(super_food, scalar_by_vector(food_combination[food_idx], food[food_idx]));

        return 1 / deviation(super_food, rda);
    }

    /* void print_nutrition() {
        std::cout << "Nutritional coverage:";
        usda::food_t super_food = scalar_by_vector(population[max_fitness_idx][0], food[0]);

        for (auto food_idx = 1; food_idx < population[max_fitness_idx].size(); ++food_idx)
            super_food = add_vectors(super_food, scalar_by_vector(population[max_fitness_idx][food_idx], food[food_idx]));

        for (auto nutr_idx = 0; nutr_idx < super_food.size(); ++nutr_idx)
            std::cout << "\n\t" << ((super_food[nutr_idx] * 100) / rda[nutr_idx]) << "%" << (nutr_idx == 2 ? " *" : "");
        
        std::cout << "\n";
    } */
}