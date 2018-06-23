#pragma once

#include <iostream>
#include <vector>
#include <numeric>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include <chrono>
#include <random>

#include "utils.cpp"
#include "usda.cpp"

/**
 *
 */
namespace ga {

    using individual_val_t = double; // grams
    using individual_t = std::vector<individual_val_t>;
    using population_t = std::vector<individual_t>;
    
    using fitness_val_t = double; // from 0 to 1 (?)
    using fitness_arr_t = std::vector<fitness_val_t>;

    /**
     * Create a population of food combinations, with random quantities of each food between 0 and the maximum given
     * for that food.
     */
    auto first_population(int size, const usda::food_max_arr_t& food_max) {
        population_t population = {};

        for (auto i = 0; i < size; ++i) {
            individual_t individual = {};

            for (auto food_idx = 0; food_idx < food_max.size(); ++food_idx)
                individual.push_back((std::rand() % (int) (food_max[food_idx] + 1)) / 32); // FIXME.

            population.push_back(individual);
        }
        return population;
    }

    /**
     * Reproduce two individuals generating a new one.
     */
    auto cross(const individual_t& a, const individual_t& b) {
        auto new_individual = a;

        for (auto i = 0; i < new_individual.size(); ++i)
            if (std::rand() % 2 == 0)
                new_individual[i] = b[i];

        return new_individual;
    }

    /**
     * Alter the components of an individual.
     */
    auto mutate(const individual_t& individual, int probability, int change_rate) {
        assert(probability >= 0 && probability <= 100);
        assert(change_rate >= 0 && change_rate <= 100);

        auto new_individual = individual;

        for (auto& food_qty : new_individual) {
            if (std::rand() % 101 < probability) {
                auto diff = food_qty * (change_rate / 100);

                if (std::rand() % 2 == 0)
                    food_qty += diff;
                else
                    food_qty -= diff;
            }
        }
        return new_individual;
    }

    /**
     * Calculate the fitness value (based on the NRMSD) for each individual on the population as a measure of how good
     * it is.
     */
    auto fitness(const population_t& population, const usda::food_arr_t& food, const usda::rda_t& rda) {
        fitness_arr_t result = {};

        for (const auto& individual : population) {
            auto super_food = utils::scalar_by_vector(individual[0], food[0]);

            for (auto food_idx = 1; food_idx < individual.size(); ++food_idx)
                super_food = utils::add_vectors(super_food, utils::scalar_by_vector(individual[food_idx], food[food_idx]));

            result.push_back(1 / utils::deviation(super_food, rda));
        }

        // Normalize.
        /* auto max = *std::max_element(std::begin(result), std::end(result));
        auto min = *std::min_element(std::begin(result), std::end(result));
        auto diff = max - min;

        for (auto& value : result)
            value = (value - min) / diff; */

        return result;
    }

    /**
     * Evolves the given population.
     */
    auto next_population(const population_t& current_population, const usda::food_arr_t& food, const usda::rda_t& rda, int mut_probability, int mut_change_rate) {
        auto current_fitness = fitness(current_population, food, rda);

        std::mt19937 generator(std::time(0));
        std::discrete_distribution<int> distribution(current_fitness.begin(), current_fitness.end());

        population_t next_population = {};

        // Selection (duplication).
        for (const auto& individual : current_population)
            next_population.push_back(current_population[distribution(generator)]);

        // Recombination (crossover) and mutation.
        auto size = next_population.size();

        for (auto& individual : next_population)
            individual = mutate(cross(individual, next_population[std::rand() % size]), mut_probability, mut_change_rate);

        return next_population;
    }

    /**
     * Start the execution of the genetic algorithm.
     */
    void run(int population_size, int mut_probability, int mut_change_rate, int max_generations) {
        auto start = std::chrono::high_resolution_clock::now();
        std::srand(std::time(0));

        auto rda = usda::rda();
        auto ul = usda::ul();
        assert(rda.size() == ul.size());

        auto food = usda::food_data();
        auto food_ids = usda::food_ids();
        auto food_names = usda::food_names();
        auto food_max = usda::food_max(food, ul);
        assert(food.size() == food_ids.size());
        assert(food.size() == food_names.size());
        assert(food.size() == food_max.size());
        
        auto population = first_population(population_size, food_max);

        // TODO: improve termination criteria.
        for (auto i = 0; i < max_generations; ++i)
            population = next_population(population, food, rda, mut_probability, mut_change_rate);
        
        auto end = std::chrono::high_resolution_clock::now();
        auto seconds_elapsed = std::chrono::duration_cast<std::chrono::seconds>(end - start).count();

        std::ofstream output_file;
        output_file.open("output.txt", std::ios_base::app);

        auto now = std::time(0);
        output_file
            << "Date (UTC): " << std::asctime(std::gmtime(&now))
            << "Execution time (seconds): " << seconds_elapsed
            << "\nPopulation size: " << population_size 
            << "\nMutation probability (%): " << mut_probability 
            << "\nMutation change rate (%): " << mut_change_rate 
            << "\nMaximum generations: " << max_generations;

        // TODO: improve (take the best on each call at next_population()).
        auto all_fitness = fitness(population, food, rda);
        auto max_fitness = all_fitness[0];
        auto max_fitness_idx = 0;
        for (auto i = 1; i < all_fitness.size(); ++i) {
            if (all_fitness[i] > max_fitness) {
                max_fitness = all_fitness[i];
                max_fitness_idx = i;
            }
        }

        output_file << "\nBest food combination (fitness value of " << max_fitness << "):";

        for (auto food_idx = 0; food_idx < population[max_fitness_idx].size(); ++food_idx)
            output_file << "\n\t" << population[max_fitness_idx][food_idx] << "\t" << food_names[food_idx];
        
        std::cout << "Nutritional coverage:";
        usda::food_t super_food = utils::scalar_by_vector(population[max_fitness_idx][0], food[0]);

        for (auto food_idx = 1; food_idx < population[max_fitness_idx].size(); ++food_idx)
            super_food = utils::add_vectors(super_food, utils::scalar_by_vector(population[max_fitness_idx][food_idx], food[food_idx]));

        for (auto nutr_idx = 0; nutr_idx < super_food.size(); ++nutr_idx)
            std::cout << "\n\t" << ((super_food[nutr_idx] * 100) / rda[nutr_idx]) << "%" << (nutr_idx == 2 ? " *" : "");
        
        std::cout << "\n";

        output_file << "\n\n";
    }
}
