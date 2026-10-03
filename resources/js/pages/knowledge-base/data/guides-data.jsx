import React from "react";

export const GUIDES = [
    // ─── Git & deployments ───────────────────────────────────────────────
    {
        id: 1,
        title: "How to connect your project to GitHub",
        description: (
            <>
                Connect your <span className="text-blue-500">GitHub account</span>{" "}
                and deploy a website straight from one of your{" "}
                <span className="text-blue-500">repositories</span>.
            </>
        ),
        subtitle: (
            <>
                Deploying from GitHub clones the{" "}
                <span className="text-blue-500">branch</span> you pick into
                your website's storage and serves it right away — no manual
                file uploads needed.
            </>
        ),
        category: "Git & deployments",
        read: "4 min read",
        updated: "Aug 14, 2026",
        steps: [
            {
                title: "Make sure you have an active plan",
                description: (
                    <>
                        You need an active hosting plan before you can deploy.
                        If you haven't chosen one yet, the{" "}
                        <span className="text-blue-500">Deploy New Site</span>{" "}
                        button will ask you to choose a plan first.
                    </>
                ),
            },
            {
                title: "Click Deploy New Site",
                description: (
                    <>
                        From your dashboard, click{" "}
                        <span className="text-blue-500">Deploy New Site</span>.
                        If your GitHub account isn't linked yet, you'll see the{" "}
                        <span className="text-blue-500">
                            Connect your GitHub account
                        </span>{" "}
                        prompt first.
                    </>
                ),
            },
            {
                title: "Authorize AsuraTech Host on GitHub",
                description: (
                    <>
                        You'll be redirected to GitHub to sign in and grant
                        read-only access (public repositories and your profile
                        only). After authorizing, you're brought back to the
                        dashboard and the deploy window opens automatically.
                    </>
                ),
            },
            {
                title: "Pick a repository and branch",
                description: (
                    <>
                        In the deploy window, choose a{" "}
                        <span className="text-blue-500">Repository</span> from
                        the dropdown, then pick the{" "}
                        <span className="text-blue-500">Branch</span> you want
                        to deploy.
                    </>
                ),
            },
            {
                title: "Add optional build settings",
                description: (
                    <>
                        You can fill in a{" "}
                        <span className="text-blue-500">Build command</span>{" "}
                        and{" "}
                        <span className="text-blue-500">
                            Output directory
                        </span>{" "}
                        for reference — these are saved with your site. Plain
                        static files and Laravel projects work without filling
                        them in.
                    </>
                ),
            },
            {
                title: "Create the site",
                description: (
                    <>
                        Confirm to start the deployment. The site's status
                        shows{" "}
                        <span className="text-blue-500">Deploying</span> while
                        the repository is cloned, then switches to{" "}
                        <span className="text-blue-500">Live</span> once your
                        files are in place.
                    </>
                ),
                tips: [
                    "Only public repositories and repos you have read access to will appear in the list.",
                    "Detected Laravel projects automatically get a matching database and .env credentials.",
                ],
            },
        ],
    },
    {
        id: 2,
        title: "Why my deployment failed and how to fix it",
        description: (
            <>
                What a <span className="text-blue-500">Failed</span> site
                status usually means, and how to get your site deploying
                again.
            </>
        ),
        subtitle: (
            <>
                Deployments clone your repository as-is — there's no build
                step yet, so most failures come from access or repository
                structure issues rather than code errors.
            </>
        ),
        category: "Git & deployments",
        read: "3 min read",
        updated: "Aug 9, 2026",
        steps: [
            {
                title: "Check the site status",
                description: (
                    <>
                        Open the website from your dashboard. A{" "}
                        <span className="text-blue-500">Failed</span> badge
                        means the clone job couldn't finish.
                    </>
                ),
            },
            {
                title: "Repository access issue",
                description: (
                    <>
                        If your GitHub token expired or access was revoked, the
                        deploy window will prompt you to{" "}
                        <span className="text-blue-500">Reconnect GitHub</span>{" "}
                        before trying again.
                    </>
                ),
            },
            {
                title: "Private or missing repository",
                description: (
                    <>
                        Only repositories your connected GitHub account can
                        read will show up. Double-check the repo still exists
                        and that you selected the correct branch.
                    </>
                ),
            },
            {
                title: "Try deploying again",
                description: (
                    <>
                        Start a new deployment from{" "}
                        <span className="text-blue-500">Deploy New Site</span>{" "}
                        with the same repository once the issue is resolved. A
                        failed attempt never affects any other site you
                        already have live.
                    </>
                ),
            },
        ],
    },

    // ─── Getting started ─────────────────────────────────────────────────
    {
        id: 3,
        title: "From signup to your first live website",
        description: (
            <>
                The full path from choosing a{" "}
                <span className="text-blue-500">plan</span> to deploying your{" "}
                <span className="text-blue-500">first website</span>.
            </>
        ),
        subtitle:
            "An active, paid subscription is required before you can deploy a website.",
        category: "Getting started",
        searchTerms: ["signup", "register", "password", "QR Ph", "plan", "deploy"],
        read: "4 min read",
        updated: "Oct 3, 2026",
        steps: [
            {
                title: "Choose a plan",
                description: (
                    <>
                        Pick a plan from the pricing section and click{" "}
                        <span className="text-blue-500">Choose Plan</span>.
                        This takes you to registration with your plan already
                        selected.
                    </>
                ),
            },
            {
                title: "Create your account",
                description: (
                    <>
                        Fill in your name, email, and password to create your
                        account. Your password needs at least 8 characters,
                        including uppercase and lowercase letters, a number,
                        and a special character. You'll be signed in and taken
                        straight to checkout.
                    </>
                ),
            },
            {
                title: "Pay with QR Ph",
                description: (
                    <>
                        On the checkout page, review your plan and any
                        add-ons, choose a billing period, then click{" "}
                        <span className="text-blue-500">Pay with QR Ph</span>.
                        Scan the QR code with your banking or e-wallet app to
                        complete payment.
                    </>
                ),
            },
            {
                title: "Wait for confirmation",
                description: (
                    <>
                        Once payment is confirmed, your subscription becomes{" "}
                        <span className="text-blue-500">Active</span> and you
                        can head to your dashboard.
                    </>
                ),
            },
            {
                title: "Deploy your first site",
                description: (
                    <>
                        From the dashboard, click{" "}
                        <span className="text-blue-500">Deploy New Site</span>,
                        connect GitHub, and pick the repository you want to go
                        live.
                    </>
                ),
            },
        ],
    },

    // ─── Databases ───────────────────────────────────────────────────────
    {
        id: 5,
        title: "Create a MySQL database for your project",
        description: (
            <>
                Create a real{" "}
                <span className="text-blue-500">MySQL database</span>, get its
                credentials, and connect it from phpMyAdmin.
            </>
        ),
        subtitle: (
            <>
                Every database you create is provisioned instantly with its
                own name, user, and password, scoped to your account.
            </>
        ),
        category: "Databases",
        read: "4 min read",
        updated: "Aug 11, 2026",
        steps: [
            {
                title: "Open Create database",
                description: (
                    <>
                        Go to{" "}
                        <span className="text-blue-500">
                            Files & Database → Databases
                        </span>{" "}
                        and click{" "}
                        <span className="text-blue-500">Create database</span>.
                    </>
                ),
            },
            {
                title: "Name your database",
                description: (
                    <>
                        Enter a name using lowercase letters, numbers, and
                        underscores (3–32 characters). It's stored as{" "}
                        <span className="text-blue-500">
                            stu_&#123;your_id&#125;_&#123;name&#125;
                        </span>{" "}
                        behind the scenes.
                    </>
                ),
            },
            {
                title: "Set a password",
                description: (
                    <>
                        Enter a password between 8–64 characters with an
                        uppercase letter, lowercase letter, digit, and symbol —
                        or click{" "}
                        <span className="text-blue-500">Generate</span> for a
                        strong one automatically. Confirm it, then submit.
                    </>
                ),
                tips: [
                    "Avoid quotes, backticks, and backslashes in your password — they aren't accepted.",
                    "You'll see a \"Database is ready\" confirmation once it's created.",
                ],
            },
            {
                title: "Get your credentials",
                description: (
                    <>
                        On the database card, click{" "}
                        <span className="text-blue-500">Show credentials</span>{" "}
                        to reveal the host, port, database name, username, and
                        password, or copy the full connection string in one
                        click.
                    </>
                ),
            },
            {
                title: "Manage it in phpMyAdmin",
                description: (
                    <>
                        Click{" "}
                        <span className="text-blue-500">Open phpMyAdmin</span>{" "}
                        on an active database to manage tables and run queries
                        directly.
                    </>
                ),
            },
        ],
    },

    // ─── Files & storage ─────────────────────────────────────────────────
    {
        id: 6,
        title: "Browsing and editing your website files",
        description: (
            <>
                Use the{" "}
                <span className="text-blue-500">file manager</span> to
                navigate, create, and edit the files behind a live website.
            </>
        ),
        subtitle: (
            <>
                The file manager reads and writes directly to your website's
                storage, so changes take effect immediately.
            </>
        ),
        category: "Files & storage",
        read: "3 min read",
        updated: "Jul 18, 2026",
        steps: [
            {
                title: "Select your website",
                description: (
                    <>
                        Go to{" "}
                        <span className="text-blue-500">
                            Files & Database → File manager
                        </span>{" "}
                        and choose a website from the dropdown. Only sites
                        with a{" "}
                        <span className="text-blue-500">Live</span> status can
                        be browsed.
                    </>
                ),
            },
            {
                title: "Navigate folders",
                description: (
                    <>
                        Click a folder to open it. The breadcrumb at the top
                        shows your current path so you can jump back to any
                        parent folder.
                    </>
                ),
            },
            {
                title: "Create a file",
                description: (
                    <>
                        Click{" "}
                        <span className="text-blue-500">Create File</span>,
                        enter a file name, then either type content directly
                        or upload a file (choosing one clears the other).
                        Files are capped at 10 MB.
                    </>
                ),
            },
            {
                title: "Edit an existing file",
                description: (
                    <>
                        Click the pencil icon next to a file to open it in the
                        editor, make your changes, and save. Binary or overly
                        large files can't be opened this way.
                    </>
                ),
                tips: [
                    "There's currently no download or delete option from the file manager — plan file changes accordingly.",
                ],
            },
        ],
    },

    // ─── Billing ─────────────────────────────────────────────────────────
    {
        id: 7,
        title: "How checkout and payment works",
        description: (
            <>
                What happens after you pick a plan, and how{" "}
                <span className="text-blue-500">QR Ph</span> payment activates
                your subscription.
            </>
        ),
        subtitle:
            "QR Ph is currently the available payment method. Cards and e-wallets remain unavailable until enabled for the PayMongo account.",
        category: "Billing",
        searchTerms: ["payment", "checkout", "QR Ph", "card", "GCash", "Maya", "GrabPay", "invoice", "PDF"],
        read: "3 min read",
        updated: "Oct 3, 2026",
        steps: [
            {
                title: "Review your plan on checkout",
                description: (
                    <>
                        The checkout page shows your chosen plan's features,
                        plus any add-ons you can include.
                    </>
                ),
            },
            {
                title: "Pick a billing period",
                description: (
                    <>
                        Choose one of the billing periods available for that
                        plan, such as monthly or a multi-year period. The total
                        updates as you choose add-ons.
                    </>
                ),
            },
            {
                title: "Pay with QR Ph",
                description: (
                    <>
                        QR Ph is currently available. Debit/credit cards,
                        GCash, Maya, and GrabPay appear as temporarily
                        unavailable until enabled on the PayMongo account.
                        Choose QR Ph to generate a code, then scan it with
                        your banking or e-wallet app. The page checks payment
                        status and shows when the code expires.
                    </>
                ),
            },
            {
                title: "Subscription activation",
                description: (
                    <>
                        Once payment is confirmed, your subscription is marked{" "}
                        <span className="text-blue-500">Active</span> and you
                        can head to your dashboard. A paid invoice is also
                        emailed to you, and you can download it from Account
                        & Billing → Subscription & invoices.
                    </>
                ),
            },
            {
                title: "Changing plans later",
                description: (
                    <>
                        From{" "}
                        <span className="text-blue-500">
                            Account & Billing
                        </span>
                        , click{" "}
                        <span className="text-blue-500">Change plan</span> to
                        go back to the plans page and check out a different
                        plan.
                    </>
                ),
                tips: [
                    "Keep an eye on your renewal date in Account & Billing — reach out to support if you have questions about your subscription.",
                ],
            },
        ],
    },
    {
        id: 8,
        title: "Enable email two-factor authentication",
        description: (
            <>
                Add an emailed verification code to sign-in after your
                password, and learn how to complete the challenge.
            </>
        ),
        subtitle:
            "Two-factor authentication (2FA) sends a one-time code to your account email when you sign in.",
        category: "Account security",
        searchTerms: ["2FA", "two-factor", "email code", "OTP", "login", "security"],
        read: "3 min read",
        updated: "Oct 3, 2026",
        steps: [
            {
                title: "Open your security settings",
                description: (
                    <>
                        Go to Account & Billing → Profile and find the{" "}
                        <span className="text-blue-500">Security</span>{" "}
                        section.
                    </>
                ),
            },
            {
                title: "Enable and verify 2FA",
                description: (
                    <>
                        Choose <span className="text-blue-500">Enable 2FA</span>.
                        Enter the six-digit code sent to your account email to
                        confirm setup. 2FA is enabled after the code verifies.
                    </>
                ),
            },
            {
                title: "Complete the next sign-in",
                description: (
                    <>
                        After your password is accepted, enter the new six-digit
                        code from your email on the verification page. Codes
                        expire after 10 minutes. Use{" "}
                        <span className="text-blue-500">Resend code</span> if
                        needed; repeated incorrect codes will return you to
                        login.
                    </>
                ),
                tips: [
                    "If you no longer have access to the account email, contact support before signing out.",
                    "You can disable 2FA from the same Security section while signed in.",
                ],
            },
        ],
    },
];
