<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Transaction> */
class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->words(3, true),
            'amount' => fake()->randomFloat(2, 1, 500),
            'category' => fake()->randomElement(Transaction::CATEGORIES),
            'transaction_date' => fake()->dateTimeBetween('-2 months')->format('Y-m-d'),
            'payment_method' => fake()->randomElement(Transaction::PAYMENT_METHODS),
            'notes' => null,
        ];
    }
}
