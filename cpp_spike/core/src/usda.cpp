#pragma once

#include <vector>
#include <string>

#include <mysql_connection.h>
#include <driver.h>
#include <exception.h>
#include <resultset.h>
#include <statement.h>

/**
 * Nutritional data from the USDA database.
 */
namespace usda {

    using nutrient_t = double;
    using food_t = std::vector<nutrient_t>;
    using food_arr_t = std::vector<food_t>;

    using rda_t = std::vector<nutrient_t>;

    using food_id_t = std::string;
    using food_ids_t = std::vector<food_id_t>;

    using food_name_t = std::string;
    using food_names_t = std::vector<food_name_t>;

    using food_max_val_t = double; // grams
    using food_max_arr_t = std::vector<food_max_val_t>;
    
    food_ids_t _food_ids;
    food_names_t _food_names;

    /**
     * Recommended Dietary Allowance.
     * TODO: values should be chosen according to genre, age, height, weight and activity level.
     */
    rda_t rda() {
        return {
            44, // Protein
            359.5, // Carbohydrate, by difference
            2616, // Energy
            3.7 * 1000, // Water
            1000, // Calcium, Ca
            400, // Magnesium, Mg
            4.7 * 1000, // Potassium, K
            11, // Zinc, Zn
            4, // Fluoride, F
            55, // Selenium, Se
            // 0, // Retinol
            // 0, // Carotene, beta
            15, // Vitamin E (alpha-tocopherol)
            // 0, // Vitamin D2 (ergocalciferol)
            15, // Vitamin D (D2 + D3)
            1, // Thiamin
            16, // Niacin
            1, // Vitamin B-6
            2, // Vitamin B-12
            120, // Vitamin K (phylloquinone)
            400, // Folate, food
            // 0, // Vitamin E, added
            0, // Cholesterol
            0, // Fatty acids, total saturated
            // 0, // Fatty acids, total polyunsaturated
            0 // Fatty acids, total trans-monoenoic
            // 0, // 22:6 n-3 (DHA)
            // 0, // 20:5 n-3 (EPA)
            // 0, // 22:5 n-3 (DPA)
            // 0 // 18:3 n-3 c,c,c (ALA)
        };
    }

    /**
     * Tolerable Upper Intake Level.
     * TODO.
     */
    rda_t ul() {
        return {
            44, // Protein
            359.5, // Carbohydrate, by difference
            2616, // Energy
            3.7 * 1000, // Water
            1000, // Calcium, Ca
            400, // Magnesium, Mg
            4.7 * 1000, // Potassium, K
            11, // Zinc, Zn
            4, // Fluoride, F
            55, // Selenium, Se
            // 0, // Retinol
            // 0, // Carotene, beta
            15, // Vitamin E (alpha-tocopherol)
            // 0, // Vitamin D2 (ergocalciferol)
            15, // Vitamin D (D2 + D3)
            1, // Thiamin
            16, // Niacin
            1, // Vitamin B-6
            2, // Vitamin B-12
            120, // Vitamin K (phylloquinone)
            400, // Folate, food
            // 0, // Vitamin E, added
            0, // Cholesterol
            0, // Fatty acids, total saturated
            // 0, // Fatty acids, total polyunsaturated
            0 // Fatty acids, total trans-monoenoic
            // 0, // 22:6 n-3 (DHA)
            // 0, // 20:5 n-3 (EPA)
            // 0, // 22:5 n-3 (DPA)
            // 0 // 18:3 n-3 c,c,c (ALA)
        };
    }

    /**
     * Amount of each nutrient in 1 gram of food.
     */
    auto food_data() {
        auto driver = get_driver_instance();
        auto con = driver->connect("tcp://127.0.0.1:3306", "root", "m0039dAnIh$&E5");
        con->setSchema("usdanlsr28");

        auto stmt = con->createStatement();
        auto res = stmt->executeQuery(R"(
            select food.NDB_No 'ID', food.Shrt_Desc 'Name',
                sum(if(ndata.Nutr_No = '203', ndata.Nutr_Val, 0)) 'Protein',
                sum(if(ndata.Nutr_No = '205', ndata.Nutr_Val, 0)) 'Carbohydrate, by difference',
                sum(if(ndata.Nutr_No = '208', ndata.Nutr_Val, 0)) 'Energy',
                sum(if(ndata.Nutr_No = '255', ndata.Nutr_Val, 0)) 'Water',
                sum(if(ndata.Nutr_No = '301', ndata.Nutr_Val, 0)) 'Calcium, Ca',
                sum(if(ndata.Nutr_No = '304', ndata.Nutr_Val, 0)) 'Magnesium, Mg',
                sum(if(ndata.Nutr_No = '306', ndata.Nutr_Val, 0)) 'Potassium, K',
                sum(if(ndata.Nutr_No = '309', ndata.Nutr_Val, 0)) 'Zinc, Zn',
                sum(if(ndata.Nutr_No = '313', ndata.Nutr_Val, 0)) 'Fluoride, F',
                sum(if(ndata.Nutr_No = '317', ndata.Nutr_Val, 0)) 'Selenium, Se',
                -- sum(if(ndata.Nutr_No = '319', ndata.Nutr_Val, 0)) 'Retinol',
                -- sum(if(ndata.Nutr_No = '321', ndata.Nutr_Val, 0)) 'Carotene, beta',
                sum(if(ndata.Nutr_No = '323', ndata.Nutr_Val, 0)) 'Vitamin E (alpha-tocopherol)',
                -- sum(if(ndata.Nutr_No = '325', ndata.Nutr_Val, 0)) 'Vitamin D2 (ergocalciferol)',
                sum(if(ndata.Nutr_No = '328', ndata.Nutr_Val, 0)) 'Vitamin D (D2 + D3)',
                sum(if(ndata.Nutr_No = '404', ndata.Nutr_Val, 0)) 'Thiamin',
                sum(if(ndata.Nutr_No = '406', ndata.Nutr_Val, 0)) 'Niacin',
                sum(if(ndata.Nutr_No = '415', ndata.Nutr_Val, 0)) 'Vitamin B-6',
                sum(if(ndata.Nutr_No = '418', ndata.Nutr_Val, 0)) 'Vitamin B-12',
                sum(if(ndata.Nutr_No = '430', ndata.Nutr_Val, 0)) 'Vitamin K (phylloquinone)',
                sum(if(ndata.Nutr_No = '432', ndata.Nutr_Val, 0)) 'Folate, food',
                -- sum(if(ndata.Nutr_No = '573', ndata.Nutr_Val, 0)) 'Vitamin E, added',
                sum(if(ndata.Nutr_No = '601', ndata.Nutr_Val, 0)) 'Cholesterol',
                sum(if(ndata.Nutr_No = '606', ndata.Nutr_Val, 0)) 'Fatty acids, total saturated',
                -- sum(if(ndata.Nutr_No = '646', ndata.Nutr_Val, 0)) 'Fatty acids, total polyunsaturated',
                sum(if(ndata.Nutr_No = '693', ndata.Nutr_Val, 0)) 'Fatty acids, total trans-monoenoic'
                -- sum(if(ndata.Nutr_No = '621', ndata.Nutr_Val, 0)) '22:6 n-3 (DHA)',
                -- sum(if(ndata.Nutr_No = '629', ndata.Nutr_Val, 0)) '20:5 n-3 (EPA)',
                -- sum(if(ndata.Nutr_No = '631', ndata.Nutr_Val, 0)) '22:5 n-3 (DPA)',
                -- sum(if(ndata.Nutr_No = '851', ndata.Nutr_Val, 0)) '18:3 n-3 c,c,c (ALA)'
            from NUT_DATA ndata
            join FOOD_DES food on food.NDB_No = ndata.NDB_No
            join NUTR_DEF ndef on ndef.Nutr_No = ndata.Nutr_No
            join FD_GROUP cat on cat.FdGrp_Cd = food.FdGrp_Cd
            where cat.FdGrp_Cd in (
                '0900', -- Fruits and fruit juices
                '1100' -- Vegetables and vegetable products
            )
            and food.Survey = 'Y'
            group by food.NDB_No
            order by food.NDB_No asc
        )");

        auto grams_in_db = 100;
        food_arr_t food = {};

        while (res->next()) {
            _food_ids.push_back(res->getString("ID"));
            _food_names.push_back(res->getString("Name"));

            food.push_back({
                (nutrient_t) res->getDouble("Protein") / grams_in_db,
                (nutrient_t) res->getDouble("Carbohydrate, by difference") / grams_in_db,
                (nutrient_t) res->getDouble("Energy") / grams_in_db,
                (nutrient_t) res->getDouble("Water") / grams_in_db,
                (nutrient_t) res->getDouble("Calcium, Ca") / grams_in_db,
                (nutrient_t) res->getDouble("Magnesium, Mg") / grams_in_db,
                (nutrient_t) res->getDouble("Potassium, K") / grams_in_db,
                (nutrient_t) res->getDouble("Zinc, Zn") / grams_in_db,
                (nutrient_t) res->getDouble("Fluoride, F") / grams_in_db,
                (nutrient_t) res->getDouble("Selenium, Se") / grams_in_db,
                // (nutrient_t) res->getDouble("Retinol") / grams_in_db,
                // (nutrient_t) res->getDouble("Carotene, beta") / grams_in_db,
                (nutrient_t) res->getDouble("Vitamin E (alpha-tocopherol)") / grams_in_db,
                // (nutrient_t) res->getDouble("Vitamin D2 (ergocalciferol)") / grams_in_db,
                (nutrient_t) res->getDouble("Vitamin D (D2 + D3)") / grams_in_db,
                (nutrient_t) res->getDouble("Thiamin") / grams_in_db,
                (nutrient_t) res->getDouble("Niacin") / grams_in_db,
                (nutrient_t) res->getDouble("Vitamin B-6") / grams_in_db,
                (nutrient_t) res->getDouble("Vitamin B-12") / grams_in_db,
                (nutrient_t) res->getDouble("Vitamin K (phylloquinone)") / grams_in_db,
                (nutrient_t) res->getDouble("Folate, food") / grams_in_db,
                // (nutrient_t) res->getDouble("Vitamin E, added") / grams_in_db,
                (nutrient_t) res->getDouble("Cholesterol") / grams_in_db,
                (nutrient_t) res->getDouble("Fatty acids, total saturated") / grams_in_db,
                // (nutrient_t) res->getDouble("Fatty acids, total polyunsaturated") / grams_in_db,
                (nutrient_t) res->getDouble("Fatty acids, total trans-monoenoic") / grams_in_db
                // (nutrient_t) res->getDouble("22:6 n-3 (DHA)") / grams_in_db,
                // (nutrient_t) res->getDouble("20:5 n-3 (EPA)") / grams_in_db,
                // (nutrient_t) res->getDouble("22:5 n-3 (DPA)") / grams_in_db,
                // (nutrient_t) res->getDouble("18:3 n-3 c,c,c (ALA)") / grams_in_db
            });
        }

        delete res;
        delete stmt;
        delete con;

        return food;
    }

    /**
     * Food identifiers in the database.
     */
    auto food_ids() {
        assert(_food_ids.size() > 0);
        return _food_ids;
    }

    /**
     * Food names in the database.
     */
    auto food_names() {
        assert(_food_names.size() > 0);
        return _food_names;
    }

    /**
     * Maximum amount of each food one could eat, in grams.
     */
    auto food_max(const food_arr_t& food, const rda_t& ul) {
        food_max_arr_t food_max = {};

        for (const auto& elem : food) {
            assert(elem.size() == ul.size());
            food_max_val_t max_for_elem = -1;

            for (auto nutr_idx = 0; nutr_idx < elem.size(); ++nutr_idx) {
                if (ul[nutr_idx] == 0 || elem[nutr_idx] == 0)
                    continue;

                auto new_max = ul[nutr_idx] / elem[nutr_idx];

                if (max_for_elem == -1 || new_max < max_for_elem)
                    max_for_elem = new_max;
            }
            food_max.push_back(max_for_elem);
        }
        return food_max;
    }
}