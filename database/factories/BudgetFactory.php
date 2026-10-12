<?php

namespace Database\Factories;

use App\Models\Budget;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Budget> */
class BudgetFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'year' => (int) now()->format('Y'),
            'month' => (int) now()->format('n'),
            'amount' => fake()->randomFloat(2, 100, 2000),
        ];
    }
}
