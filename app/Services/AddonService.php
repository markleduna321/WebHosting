<?php

namespace App\Services;

use App\Models\Addon;
use Illuminate\Support\Str;

class AddonService
{
    public function create(array $data): Addon
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        return Addon::create($data);
    }

    public function update(Addon $addon, array $data): Addon
    {
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $addon->update($data);

        return $addon->fresh();
    }

    public function delete(Addon $addon): void
    {
        $addon->delete();
    }
}
