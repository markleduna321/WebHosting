import React from "react";

export const GUIDES = [
    // ─── Git & deployments ───────────────────────────────────────────────
    {
        id: 1,
        title: "How to connect your project to GitHub",
        description: (
            <>
                Link a <span className="text-blue-500">GitHub repository</span>{" "}
                to a <span className="text-blue-500">website</span> so every
                push to your{" "}
                <span className="text-blue-500">main branch</span> deploys
                automatically.
            </>
        ),
        subtitle: (
            <>
                Connecting GitHub turns your repository into the{" "}
                <span className="text-blue-500">source</span> of truth for a
                website. AsuraTech Host clones the{" "}
                <span className="text-blue-500">branch</span> you pick, runs
                your build <span className="text-blue-500">command</span>, and
                publishes the{" "}
                <span className="text-blue-500">output</span> — no manual
                uploads.
            </>
        ),
        category: "Git & deployments",
        read: "6 min read",
        updated: "Aug 14, 2026",
        steps: [
            {
                title: "Open the website you want to connect",
                description: (
                    <>
                        Go to <span className="text-blue-500">Website</span>,
                        open the site, then choose{" "}
                        <span className="text-blue-500">
                            Deployments → Connect repository
                        </span>
                        . You can connect one repository per website.
                    </>
                ),
            },
            {
                title: "Authorize AsuraTech Host on GitHub",
                description: (
                    <>
                        Sign in with GitHub and grant read access to the
                        repositories you want to deploy. Student accounts can
                        pick{" "}
                        <span className="text-blue-500">individual repos</span>{" "}
                        instead of the whole account.
                    </>
                ),
            },
            {
                title: "Choose the repository and branch",
                description:
                    "Select your repo and the branch to track — usually main. Pushes to other branches create preview deployments instead of replacing your live site.",
            },
            {
                title: "Set your build command and output folder",
                description:
                    "Static HTML sites need no build step. For Vite, React, or Astro projects use the settings below, then save.",
                code: `Install command:   npm install
Build command:     npm run build
Output directory:  dist`,
            },
            {
                title: "Push a commit to deploy",
                description: (
                    <>
                        Commit and push to your{" "}
                        <span className="text-blue-500">tracked branch</span>.
                        The Deployments page shows live{" "}
                        <span className="text-blue-500">build logs</span>, and
                        the site goes live once the build succeeds.
                    </>
                ),
                code: `git add .
git commit -m "connect to AsuraTech Host"
git push origin main`,
                tips: [
                    "Keep secrets out of Git — add them under Website → Environment variables instead.",
                    "A failed build never takes your live site down; the previous deployment stays online.",
                    "Use Deployments → Redeploy to rebuild without pushing a new commit.",
                ],
            },
        ],
    },
    {
        id: 2,
        title: "Why my deployment failed and how to fix it",
        description: (
            <>
                Read build logs, spot the{" "}
                <span className="text-blue-500">failing step</span>, and recover
                from the three most common errors.
            </>
        ),
        subtitle: (
            <>
                Every deployment keeps its{" "}
                <span className="text-blue-500">full</span> log. Reading the
                last 20 lines almost{" "}
                <span className="text-blue-500">always identifies</span> the
                problem.
            </>
        ),
        category: "Git & deployments",
        read: "5 min read",
        updated: "Aug 9, 2026",
        steps: [
            {
                title: "Open the failed deployment",
                description: (
                    <>
                        Deployments → select the red entry. The log stops at the{" "}
                        <span className="text-blue-500">step that failed</span>.
                    </>
                ),
            },
            {
                title: "Missing dependency",
                description: (
                    <>
                        If the log says a module cannot be found, the package is
                        probably{" "}
                        <span className="text-blue-500">only installed locally</span>.
                        Commit your{" "}
                        <span className="text-blue-500">package.json</span> and{" "}
                        <span className="text-blue-500">lockfile</span>.
                    </>
                ),
                code: `npm install <package> --save
git add package.json package-lock.json`,
            },
            {
                title: "TypeScript or build error",
                description: (
                    <>
                        Run the same{" "}
                        <span className="text-blue-500">build locally</span> to
                        reproduce it, fix the file named in the log, then push
                        again.
                    </>
                ),
                code: `npm run build`,
            },
            {
                title: "Wrong output directory",
                description: (
                    <>
                        If the build{" "}
                        <span className="text-blue-500">succeeds</span> but the
                        site is <span className="text-blue-500">blank</span>,
                        the output folder is wrong. Vite uses{" "}
                        <span className="text-blue-500">dist</span>. Create
                        React App uses{" "}
                        <span className="text-blue-500">build</span>.
                    </>
                ),
            },
        ],
    },

    // ─── Getting started ─────────────────────────────────────────────────
    {
        id: 3,
        title: "Launch your first website in 10 minutes",
        description: (
            <>
                From an empty dashboard to a{" "}
                <span className="text-blue-500">live URL</span> with SSL, using
                either an upload or a Git repo.
            </>
        ),
        subtitle:
            "Every plan includes a free asuratechhost.app subdomain and an automatic SSL certificate.",
        category: "Getting started",
        read: "4 min read",
        updated: "Aug 2, 2026",
        steps: [
            {
                title: "Create the website",
                description: (
                    <>
                        Press{" "}
                        <span className="text-blue-500">
                            Create New Website
                        </span>
                        , name it, and pick your free{" "}
                        <span className="text-blue-500">subdomain</span>.
                        Provisioning takes about a minute.
                    </>
                ),
            },
            {
                title: "Add your files",
                description: (
                    <>
                        <span className="text-blue-500">Upload</span> a folder
                        from the Files section, or connect a{" "}
                        <span className="text-blue-500">
                            GitHub repository
                        </span>{" "}
                        if your project has a build step.
                    </>
                ),
            },
            {
                title: "Check that it is live",
                description: (
                    <>
                        Open the domain from the{" "}
                        <span className="text-blue-500">Website</span> section.
                        A green{" "}
                        <span className="text-blue-500">Live</span> badge means
                        the certificate is issued and traffic is being served.
                    </>
                ),
            },
        ],
    },

    // ─── Domains & SSL ───────────────────────────────────────────────────
    {
        id: 4,
        title: "Point a custom domain to your website",
        description: (
            <>
                Add a domain you already own, update{" "}
                <span className="text-blue-500">DNS records</span>, and wait out
                verification.
            </>
        ),
        subtitle: (
            <>
                You can keep your domain at any registrar. AsuraTech Host only
                needs two DNS records to serve and{" "}
                <span className="text-blue-500">secure it</span>.
            </>
        ),
        category: "Domains & SSL",
        read: "5 min read",
        updated: "Jul 29, 2026",
        steps: [
            {
                title: "Add the domain",
                description: (
                    <>
                        Domains →{" "}
                        <span className="text-blue-500">Add domain</span>, type
                        the domain, and choose which website it should serve.
                    </>
                ),
            },
            {
                title: "Update DNS at your registrar",
                description: (
                    <>
                        Create these records, then save.{" "}
                        <span className="text-blue-500">Propagation</span>{" "}
                        usually{" "}
                        <span className="text-blue-500">finishes</span> in under
                        an hour.
                    </>
                ),
                code: `A      @    103.84.22.10\nCNAME  www  proxy.asuratechhost.app`,
                tips: [
                    "Never keep an old A record from a previous host — duplicate records break verification.",
                ],
            },
            {
                title: "Wait for verification and SSL",
                description: (
                    <>
                        Status moves from{" "}
                        <span className="text-blue-500">Pending</span> to{" "}
                        <span className="text-blue-500">Verified</span>, then
                        the certificate is issued automatically.{" "}
                        <span className="text-blue-500">Failed</span> status
                        means a record still points elsewhere.
                    </>
                ),
            },
        ],
    },
    {
        id: 5,
        title: "Fix an SSL certificate that will not issue",
        description: (
            <>
                What to check when a domain is{" "}
                <span className="text-blue-500">verified</span> but HTTPS still
                shows a warning.
            </>
        ),
        subtitle: (
            <>
                Certificates are issued and renewed for{" "}
                <span className="text-blue-500">you</span>, but a few DNS setups{" "}
                <span className="text-blue-500">block the challenge</span>.
            </>
        ),
        category: "Domains & SSL",
        read: "3 min read",
        updated: "Jul 21, 2026",
        steps: [
            {
                title: "Confirm the domain is verified",
                description: (
                    <>
                        SSL only starts after{" "}
                        <span className="text-blue-500">verification</span>{" "}
                        succeeds. Re-run verification from the{" "}
                        <span className="text-blue-500">domain row</span> if
                        needed.
                    </>
                ),
            },
            {
                title: "Remove conflicting CAA records",
                description: (
                    <>
                        A CAA record that only allows another authority will{" "}
                        <span className="text-blue-500">block</span> issuance.
                        Delete it or add ours.
                    </>
                ),
                code: `CAA  @  0 issue "letsencrypt.org"`,
            },
            {
                title: "Turn off registrar proxying",
                description: (
                    <>
                        If your{" "}
                        <span className="text-blue-500">registrar</span> proxies
                        traffic, set the record to{" "}
                        <span className="text-blue-500">DNS-only</span> while
                        the certificate is{" "}
                        <span className="text-blue-500">issued</span>.
                    </>
                ),
            },
        ],
    },

    // ─── Databases ───────────────────────────────────────────────────────
    {
        id: 6,
        title: "Connect your app to a MySQL or PostgreSQL database",
        description: (
            <>
                Create a database, grab the{" "}
                <span className="text-blue-500">credentials</span>, and store
                them as environment variables.
            </>
        ),
        subtitle: (
            <>
                Each database gets a private host, a dedicated user, and a size
                limit based on your{" "}
                <span className="text-blue-500">plan</span>.
            </>
        ),
        category: "Databases",
        read: "5 min read",
        updated: "Aug 11, 2026",
        steps: [
            {
                title: "Create the database",
                description: (
                    <>
                        Databases →{" "}
                        <span className="text-blue-500">Create database</span>,
                        choose the{" "}
                        <span className="text-blue-500">engine</span>, and{" "}
                        <span className="text-blue-500">attach</span> it to a
                        website.
                    </>
                ),
            },
            {
                title: "Copy the connection string",
                description: (
                    <>
                        Use the credentials shown on the database card. Never
                        commit them to Git.
                    </>
                ),
                code: `DATABASE_URL=mysql://user:password@mysql-01.asuratechhost.app:3306/portfolio_prod`,
            },
            {
                title: "Add it as an environment variable",
                description: (
                    <>
                        Website → Environment variables →{" "}
                        <span className="text-blue-500">Add</span>, then
                        redeploy so the new value is picked up.
                    </>
                ),
                tips: [
                    "Import an existing .sql dump from the database card to migrate a local project.",
                ],
            },
        ],
    },

    // ─── Files & storage ─────────────────────────────────────────────────
    {
        id: 7,
        title: "Upload, replace, and organize your site files",
        description: (
            <>
                How the file manager maps to what visitors see, and which{" "}
                <span className="text-blue-500">folder is served</span>.
            </>
        ),
        subtitle: (
            <>
                The Files section{" "}
                <span className="text-blue-500">is</span> a live view of your
                website root. Changes are{" "}
                <span className="text-blue-500">served</span> immediately.
            </>
        ),
        category: "Files & storage",
        read: "3 min read",
        updated: "Jul 18, 2026",
        steps: [
            {
                title: "Know which folder is public",
                description: (
                    <>
                        Uploaded sites serve from the root, and built sites
                        serve from your configured{" "}
                        <span className="text-blue-500">output folder</span>.
                    </>
                ),
            },
            {
                title: "Upload or replace files",
                description: (
                    <>
                        Drag <span className="text-blue-500">files</span> into
                        the <span className="text-blue-500">file list</span>.
                        Uploading a{" "}
                        <span className="text-blue-500">file</span> with an
                        existing name replaces it.
                    </>
                ),
            },
            {
                title: "Keep an index.html",
                description: (
                    <>
                        A missing index.html is the usual{" "}
                        <span className="text-blue-500">cause</span> of a 404
                        on a freshly uploaded site.
                    </>
                ),
            },
        ],
    },

    // ─── Billing ─────────────────────────────────────────────────────────
    {
        id: 8,
        title: "Upgrade your plan and understand what changes",
        description: (
            <>
                What happens to your websites, storage, and next{" "}
                <span className="text-blue-500">invoice</span> when you switch
                plans.
            </>
        ),
        subtitle:
            "Upgrades take effect immediately and you are charged a prorated amount on your next invoice.",
        category: "Billing",
        read: "2 min read",
        updated: "Aug 5, 2026",
        steps: [
            {
                title: "Go to your subscription",
                description: (
                    <>
                        Open{" "}
                        <span className="text-blue-500">Account & Billing</span>{" "}
                        →{" "}
                        <span className="text-blue-500">Subscription</span> and
                        click{" "}
                        <span className="text-blue-500">Change plan</span>.
                    </>
                ),
            },
            {
                title: "Select the new plan",
                description: (
                    <>
                        Review the storage, site slots, and price, then click{" "}
                        <span className="text-blue-500">Confirm upgrade</span>.
                        The change is instant.
                    </>
                ),
            },
            {
                title: "Check your next invoice",
                description: (
                    <>
                        A prorated charge appears in{" "}
                        <span className="text-blue-500">Invoice history</span>{" "}
                        on your next billing date.
                    </>
                ),
            },
        ],
    },
];
