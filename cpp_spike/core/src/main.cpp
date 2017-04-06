#include "ga.cpp"
#include "seq.cpp"

/**
 * Main program.
 * TODO: take arguments from command line.
 */
int main(int argc, char* argv[]) {
	auto population_size = 1024;
	auto mut_probability = 8;
	auto mut_change_rate = 64;
	auto max_generations = 128;

	// ga::run(population_size, mut_probability, mut_change_rate, max_generations);

	seq::run();

	return 0;
}
