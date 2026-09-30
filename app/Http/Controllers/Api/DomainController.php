<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domain;
use App\Http\Requests\StoreDomainRequest;
use App\Http\Resources\DomainResource;
use Illuminate\Http\Request;

class DomainController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $domains = $request->user()
            ->websites()
            ->with('domains')
            ->get()
            ->pluck('domains')
            ->flatten();

        return DomainResource::collection($domains);
    }

    public function store(StoreDomainRequest $request)
    {
        $website = $request->user()->websites()->findOrFail($request->website_id);

        $domain = $website->domains()->create([
            'domain_name' => $request->domain_name,
            'is_primary' => false,
            'ssl_status' => 'pending',
            'verification_status' => 'pending',
        ]);

        return new DomainResource($domain);
    }

    public function destroy(Request $request, Domain $domain)
    {
        // Ensure the user owns the domain
        if ($domain->website->user_id !== $request->user()->id) {
            abort(403);
        }

        $domain->delete();

        return response()->noContent();
    }
}
