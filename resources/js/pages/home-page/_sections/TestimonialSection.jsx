import React from "react";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        name: "Mark Dela Cruz",
        handle: "@markdev",
        quote:
            "CALEHO Host made it much easier to deploy our capstone project. Instead of worrying about server setup, we could focus on finishing our system.",
        date: "Sep 18, 2026",
        time: "10:42 AM",
        meta: "BSIT Student · Philippines",
        seed: "Mark Dela Cruz",
        bg: "b6e3f4",
    },
    {
        name: "Sofia Reyes",
        handle: "@sofia.codes",
        quote:
            "I was able to put my portfolio online and connect my domain without making the process complicated. The setup was simple and easy to understand.",
        date: "Sep 12, 2026",
        time: "02:18 PM",
        meta: "Web Developer · Philippines",
        seed: "Sofia Reyes",
        bg: "d1d4f9",
    },
    {
        name: "Daniel Santos",
        handle: "@danielsantos.dev",
        quote:
            "The hosting environment has been useful for our development workflow. We can deploy our project online and share one link with our instructors and clients.",
        date: "Sep 05, 2026",
        time: "09:36 AM",
        meta: "Software Developer · Cebu",
        seed: "Daniel Santos",
        bg: "ffd5cc",
    },
    {
        name: "Alyssa Garcia",
        handle: "@alyssacodes",
        quote:
            "CALEHO Host gave our student organization an affordable way to keep our website and online forms accessible without having to manage our own server.",
        date: "Aug 27, 2026",
        time: "04:25 PM",
        meta: "Student Organization · Philippines",
        seed: "Alyssa Garcia",
        bg: "c0f2d1",
    },
    {
        name: "Kevin Tan",
        handle: "@kevinbuilds",
        quote:
            "Deploying my project became much more convenient. I can work on my application locally and then make it available online when it is ready.",
        date: "Aug 19, 2026",
        time: "11:08 AM",
        meta: "IT Student · Davao",
        seed: "Kevin Tan",
        bg: "c7ddf9",
    },
    {
        name: "Maria Lopez",
        handle: "@marialopez.dev",
        quote:
            "What I like most is that the platform is focused on making hosting approachable. It is especially helpful when you're still learning how web deployment works.",
        date: "Aug 11, 2026",
        time: "03:51 PM",
        meta: "Junior Developer · Philippines",
        seed: "Maria Lopez",
        bg: "fde7b8",
    },
];

const TECHNOLOGIES = [
    {
        initials: "PH",
        name: "PHP",
        role: "Supported web applications",
    },
    {
        initials: "LR",
        name: "Laravel",
        role: "Modern PHP framework",
    },
    {
        initials: "DB",
        name: "MySQL",
        role: "Database support",
    },
    {
        initials: "JS",
        name: "JavaScript",
        role: "Modern web applications",
    },
    {
        initials: "RE",
        name: "React",
        role: "Frontend applications",
    },
    {
        initials: "HT",
        name: "HTML & CSS",
        role: "Web development",
    },
    {
        initials: "SSL",
        name: "SSL/TLS",
        role: "Secure connections",
    },
    {
        initials: "DNS",
        name: "DNS",
        role: "Domain configuration",
    },
];

export default function TestimonialSection() {
    return (
        <section
            id="testimonials"
            className="
                bg-slate-50/50
                dark:bg-slate-950
                px-4
                py-20
                sm:px-6
                lg:px-8
                transition-colors
                duration-200
            "
        >
            <div className="mx-auto max-w-7xl">

                {/* =====================================================
                    SECTION HEADER
                ====================================================== */}
                <div className="mb-20 text-center">
                    <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                        Testimonials
                    </span>

                    <h2
                        className="
                            mt-3
                            text-4xl
                            font-extrabold
                            tracking-tight
                            text-slate-900
                            dark:text-white
                            sm:text-5xl
                        "
                    >
                        What Our Users Are Saying
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-2xl
                            text-base
                            leading-7
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        See how students, developers, and organizations are
                        using CALEHO Host to bring their projects online.
                    </p>
                </div>

                {/* =====================================================
                    TESTIMONIAL GRID
                ====================================================== */}
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-x-8
                        gap-y-16
                        md:grid-cols-2
                        lg:grid-cols-3
                    "
                >
                    {TESTIMONIALS.map((item) => (
                        <div
                            key={item.handle}
                            className="group flex h-full flex-col"
                        >
                            {/* =================================================
                                TESTIMONIAL CARD
                            ================================================== */}
                            <div
                                className="
                                    relative
                                    flex
                                    min-h-[343px]
                                    h-full
                                    flex-1
                                    flex-col
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-8
                                    pt-14
                                    text-center
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-blue-200
                                    hover:shadow-xl
                                    dark:border-slate-800
                                    dark:bg-slate-900
                                    dark:hover:border-blue-900
                                "
                            >
                                {/* Avatar */}
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                                        item.seed
                                    )}&backgroundColor=${item.bg}`}
                                    alt={item.name}
                                    className="
                                        absolute
                                        -top-9
                                        left-1/2
                                        h-20
                                        w-20
                                        -translate-x-1/2
                                        rounded-full
                                        ring-4
                                        ring-slate-50
                                        transition-transform
                                        duration-300
                                        group-hover:scale-110
                                        dark:ring-slate-950
                                    "
                                />

                                {/* Name */}
                                <h3
                                    className="
                                        text-lg
                                        font-bold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {item.name}
                                </h3>

                                {/* Handle */}
                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-blue-600
                                        dark:text-blue-400
                                    "
                                >
                                    {item.handle}
                                </p>

                                {/* =================================================
                                    QUOTE CONTENT
                                ================================================== */}
                                <div
                                    className="
                                        flex
                                        flex-1
                                        flex-col
                                        items-center
                                    "
                                >
                                    <Quote
                                        className="
                                            mx-auto
                                            mb-3
                                            mt-5
                                            h-5
                                            w-5
                                            shrink-0
                                            text-slate-300
                                            dark:text-slate-700
                                        "
                                        fill="currentColor"
                                    />

                                    <p
                                        className="
                                            max-w-[320px]
                                            text-sm
                                            leading-7
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        {item.quote}
                                    </p>
                                </div>

                                {/* =================================================
                                    DATE / TIME
                                ================================================== */}
                                <div
                                    className="
                                        mt-6
                                        flex
                                        shrink-0
                                        items-center
                                        justify-between
                                        border-t
                                        border-slate-100
                                        pt-5
                                        text-xs
                                        text-slate-400
                                        dark:border-slate-800
                                        dark:text-slate-500
                                    "
                                >
                                    <span>{item.date}</span>
                                    <span>{item.time}</span>
                                </div>
                            </div>

                            {/* =================================================
                                USER META
                            ================================================== */}
                            <p
                                className="
                                    mt-4
                                    h-5
                                    text-center
                                    text-sm
                                    text-slate-400
                                    dark:text-slate-500
                                "
                            >
                                {item.meta}
                            </p>
                        </div>
                    ))}
                </div>

                {/* =====================================================
                    TECHNOLOGIES SECTION
                ====================================================== */}
                <div
                    id="partners"
                    className="
                        mt-32
                        scroll-mt-16
                        border-t
                        border-slate-200
                        pt-20
                        text-center
                        dark:border-slate-800
                    "
                >
                    {/* Small Label */}
                    <span
                        className="
                            text-sm
                            font-semibold
                            text-blue-600
                            dark:text-blue-400
                        "
                    >
                        Built for modern web development
                    </span>

                    {/* Heading */}
                    <h2
                        className="
                            mt-3
                            text-3xl
                            font-extrabold
                            tracking-tight
                            text-slate-900
                            dark:text-white
                            sm:text-4xl
                        "
                    >
                        Technologies you can work with
                    </h2>

                    {/* Description */}
                    <p
                        className="
                            mx-auto
                            mt-4
                            max-w-2xl
                            text-base
                            leading-7
                            text-slate-500
                            dark:text-slate-400
                            sm:text-lg
                        "
                    >
                        CALEHO Host is designed to support common technologies
                        used by students, developers, and modern web projects.
                    </p>

                    {/* =================================================
                        TECHNOLOGY GRID
                    ================================================== */}
                    <div
                        className="
                            mt-12
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-4
                        "
                    >
                        {TECHNOLOGIES.map((technology) => (
                            <div
                                key={technology.name}
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-4
                                    text-left
                                    transition-all
                                    duration-200
                                    hover:border-blue-200
                                    hover:shadow-sm
                                    dark:border-slate-800
                                    dark:bg-slate-900
                                    dark:hover:border-blue-900
                                "
                            >
                                {/* Icon / Initials */}
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-blue-50
                                        text-xs
                                        font-bold
                                        text-blue-600
                                        dark:bg-blue-950/60
                                        dark:text-blue-400
                                    "
                                >
                                    {technology.initials}
                                </div>

                                {/* Technology Details */}
                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                    >
                                        {technology.name}
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        {technology.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* =====================================================
                    BOTTOM MESSAGE
                ====================================================== */}
                <div className="mt-16 text-center">
                    <p
                        className="
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Built to help you learn, build, deploy, and grow
                        online.
                    </p>
                </div>
            </div>
        </section>
    );
}