<?php

namespace Tests\Feature;

use App\Models\Budget;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseTrackerTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Lunch',
            'amount' => '12.50',
            'category' => 'food',
            'transaction_date' => now()->toDateString(),
            'payment_method' => 'cash',
            'notes' => 'with friends',
        ], $overrides);
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/transactions')->assertRedirect('/login');
        $this->get('/dashboard')->assertRedirect('/login');
        $this->get('/budgets')->assertRedirect('/login');
        $this->get('/reports')->assertRedirect('/login');
        $this->post('/transactions', $this->payload())->assertRedirect('/login');
    }

    public function test_user_can_create_update_and_delete_a_transaction(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/transactions', $this->payload())
            ->assertRedirect('/transactions')
            ->assertSessionHas('success');

        $t = Transaction::firstOrFail();
        $this->assertSame($user->id, $t->user_id);
        $this->assertSame('12.50', $t->amount);

        $this->actingAs($user)->put("/transactions/{$t->id}", $this->payload(['title' => 'Dinner', 'amount' => '20']))
            ->assertRedirect('/transactions');
        $this->assertSame('Dinner', $t->fresh()->title);
        $this->assertSame('20.00', $t->fresh()->amount);

        $this->actingAs($user)->delete("/transactions/{$t->id}")->assertSessionHas('success');
        $this->assertDatabaseCount('transactions', 0);
    }

    public function test_validation_rejects_bad_input(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/transactions', $this->payload([
            'title' => '', 'amount' => '-5', 'category' => 'crypto', 'payment_method' => 'barter',
        ]))->assertSessionHasErrors(['title', 'amount', 'category', 'payment_method']);

        $this->actingAs($user)->post('/transactions', $this->payload(['amount' => '1.999']))
            ->assertSessionHasErrors('amount');
    }

    public function test_user_id_cannot_be_mass_assigned(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $this->actingAs($user)->post('/transactions', $this->payload(['user_id' => $other->id]));

        $this->assertSame($user->id, Transaction::firstOrFail()->user_id);
    }

    public function test_user_cannot_touch_another_users_transaction(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $t = Transaction::factory()->for($owner)->create(['title' => 'Secret']);

        $this->actingAs($intruder)->get("/transactions/{$t->id}/edit")->assertForbidden();
        $this->actingAs($intruder)->put("/transactions/{$t->id}", $this->payload())->assertForbidden();
        $this->actingAs($intruder)->delete("/transactions/{$t->id}")->assertForbidden();

        $this->assertSame('Secret', $t->fresh()->title);
    }

    public function test_index_only_lists_own_transactions_and_filters(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Transaction::factory()->for($user)->create(['title' => 'Bus pass', 'category' => 'transportation']);
        Transaction::factory()->for($user)->create(['title' => 'Pizza', 'category' => 'food']);
        Transaction::factory()->for($other)->create(['title' => 'Bus pass other', 'category' => 'transportation']);

        $this->actingAs($user)->get('/transactions')
            ->assertInertia(fn ($page) => $page->has('transactions.data', 2));

        $this->actingAs($user)->get('/transactions?search=bus')
            ->assertInertia(fn ($page) => $page->has('transactions.data', 1)->where('transactions.data.0.title', 'Bus pass'));

        $this->actingAs($user)->get('/transactions?category=food')
            ->assertInertia(fn ($page) => $page->has('transactions.data', 1)->where('transactions.data.0.title', 'Pizza'));
    }

    public function test_budget_upserts_per_month_and_is_scoped_to_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $y = (int) now()->format('Y');
        $m = (int) now()->format('n');

        $this->actingAs($user)->post('/budgets', ['year' => $y, 'month' => $m, 'amount' => '500'])->assertSessionHas('success');
        $this->actingAs($user)->post('/budgets', ['year' => $y, 'month' => $m, 'amount' => '750.50'])->assertSessionHas('success');

        $this->assertDatabaseCount('budgets', 1);
        $this->assertSame('750.50', Budget::first()->amount);

        $this->actingAs($other)->delete('/budgets/'.Budget::first()->id)->assertForbidden();
        $this->assertDatabaseCount('budgets', 1);

        $this->actingAs($user)->delete('/budgets/'.Budget::first()->id)->assertSessionHas('success');
        $this->assertDatabaseCount('budgets', 0);
    }

    public function test_dashboard_totals_and_remaining_budget(): void
    {
        $user = User::factory()->create();
        Transaction::factory()->for($user)->create(['amount' => '40.25', 'transaction_date' => now()->toDateString()]);
        Transaction::factory()->for($user)->create(['amount' => '10.00', 'transaction_date' => now()->toDateString()]);
        Transaction::factory()->for($user)->create(['amount' => '100.00', 'transaction_date' => now()->subMonths(3)->toDateString()]);
        Transaction::factory()->create(['amount' => '999.00', 'transaction_date' => now()->toDateString()]); // someone else's
        Budget::factory()->for($user)->create(['amount' => '200.00']);

        $this->actingAs($user)->get('/dashboard')->assertInertia(fn ($page) => $page
            ->where('stats.month_total', '50.25')
            ->where('stats.total', '150.25')
            ->where('stats.remaining', '149.75')
        );
    }

    public function test_reports_aggregate_by_category_and_month(): void
    {
        $user = User::factory()->create();
        $y = now()->year;
        Transaction::factory()->for($user)->create(['amount' => '10', 'category' => 'food', 'transaction_date' => "$y-01-05"]);
        Transaction::factory()->for($user)->create(['amount' => '15', 'category' => 'food', 'transaction_date' => "$y-01-20"]);
        Transaction::factory()->for($user)->create(['amount' => '5', 'category' => 'bills', 'transaction_date' => "$y-02-02"]);

        $this->actingAs($user)->get("/reports?year=$y")->assertInertia(fn ($page) => $page
            ->where('monthly.0.total', '25.00')
            ->where('monthly.1.total', '5.00')
            ->where('byCategory.0.category', 'food')
            ->where('byCategory.0.total', '25.00')
        );
    }
}
