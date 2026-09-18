<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Website;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class WebsiteFilesSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();

        if (! $user) {
            return;
        }

        $websites = [
            [
                'subdomain' => 'sample-site',
                'name' => 'Sample Site',
                'repository' => 'asura/sample-site',
                'title' => 'Sample Site',
                'heading' => 'Hello from Sample Site',
            ],
            [
                'subdomain' => 'portfolio',
                'name' => 'My Portfolio',
                'repository' => 'asura/portfolio',
                'title' => 'My Portfolio',
                'heading' => 'Welcome to My Portfolio',
            ],
            [
                'subdomain' => 'company',
                'name' => 'Company Website',
                'repository' => 'asura/company',
                'title' => 'Company Website',
                'heading' => 'Welcome to Our Company',
            ],
            [
                'subdomain' => 'blog',
                'name' => 'My Blog',
                'repository' => 'asura/blog',
                'title' => 'My Blog',
                'heading' => 'Welcome to My Blog',
            ],
            [
                'subdomain' => 'landing-page',
                'name' => 'Landing Page',
                'repository' => 'asura/landing-page',
                'title' => 'Landing Page',
                'heading' => 'Build Something Amazing',
            ],
        ];

        foreach ($websites as $data) {
            $website = Website::updateOrCreate(
                ['subdomain' => $data['subdomain']],
                [
                    'user_id' => $user->id,
                    'name' => $data['name'],
                    'repository_full_name' => $data['repository'],
                    'repository_default_branch' => 'main',
                    'repository_private' => false,
                    'status' => Website::STATUS_LIVE,
                    'last_deployed_at' => now(),
                ]
            );

            $root = storage_path('app/websites/' . $website->uuid);

            File::ensureDirectoryExists($root);
            File::ensureDirectoryExists($root . '/assets');

            // index.html
            File::put($root . '/index.html', <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$data['title']}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>{$data['heading']}</h1>
        <p>This website was created using the AsuraHost file manager.</p>
        <button onclick="showMessage()">Click Me</button>
    </div>

    <script src="script.js"></script>
</body>
</html>
HTML);

            // style.css
            File::put($root . '/style.css', <<<'CSS'
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f7fb;
}

.container {
    text-align: center;
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

h1 {
    color: #2563eb;
}

p {
    color: #64748b;
}

button {
    background: #2563eb;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
}

button:hover {
    background: #1d4ed8;
}
CSS);

            // script.js
            File::put($root . '/script.js', <<<'JS'
function showMessage() {
    alert("Hello from AsuraHost!");
}

console.log("Website loaded successfully.");
JS);

            // README.md
            File::put($root . '/README.md', <<<MD
# {$data['name']}

This website was seeded for testing the AsuraHost file manager.

Repository: {$data['repository']}
Branch: main
Status: Live
MD);

            // logo.svg
            File::put($root . '/assets/logo.svg', <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg"
     width="100"
     height="100"
     viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#2563eb"/>
    <text x="50"
          y="58"
          text-anchor="middle"
          font-size="28"
          fill="white"
          font-family="Arial">
        A
    </text>
</svg>
SVG);
        }
    }
}