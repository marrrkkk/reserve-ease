<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Inertia\Inertia;

class PackageController extends Controller
{
    /**
     * Display a listing of all active packages.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $packages = Package::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Packages/Index', [
            'packages' => $packages,
        ]);
    }

    /**
     * Display the specified package with its details.
     *
     * @param Package $package
     * @return \Inertia\Response
     */
    public function show(Package $package)
    {
        return Inertia::render('Packages/Show', [
            'package' => $package,
            'customizationOptions' => $package->getAvailableOptions(),
        ]);
    }

    /**
     * Get customization options for the specified package.
     *
     * @param Package $package
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCustomizationOptions(Package $package)
    {
        return response()->json([
            'options' => $package->getAvailableOptions(),
        ]);
    }

    /**
     * Display the booking form for the specified package.
     *
     * @param Package $package
     * @return \Inertia\Response
     */
    public function book(Package $package)
    {
        return Inertia::render('Packages/Book', [
            'package' => $package,
        ]);
    }
}
