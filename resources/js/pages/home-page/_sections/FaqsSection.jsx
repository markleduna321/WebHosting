import React, { useState } from "react";
import { Plus } from "lucide-react";

export default function FaqsSection() {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            question: "What is CALEHO Host?",
            answer:
                "CALEHO Host is a web hosting platform designed to help students, developers, organizations, and small businesses deploy and manage websites and web applications online.",
        },
        {
            question: "Who is CALEHO Host for?",
            answer:
                "CALEHO Host is suitable for students, developers, organizations, and small businesses looking for an affordable and straightforward way to host their websites and web applications.",
        },
        {
            question: "Is CALEHO Host only a web hosting company?",
            answer:
                "CALEHO Host focuses primarily on web hosting and related online services. Our platform is designed to make website deployment, hosting management, and account management easier for users.",
        },
        {
            question: "Do I need to know how to code to use CALEHO Host?",
            answer:
                "Not necessarily. You can deploy a website that's already built and pushed to a GitHub repository without touching the code yourself. However, some technical knowledge is helpful when working with applications such as Laravel, PHP, databases, or other web technologies.",
        },
        {
            question: "How do I actually deploy a website on CALEHO Host?",
            answer:
                "After creating an account and selecting a hosting plan, connect your GitHub account, choose the repository and branch you want to deploy, and CALEHO Host will clone it, run any required Composer or npm build steps, and publish it to your subdomain.",
        },
        {
            question: "What can I do with CALEHO Host after launching my website?",
            answer:
                "You can manage your hosting environment, monitor your website, manage your files and supported services, configure your domain or subdomain, and access available account and billing features.",
        },
        {
            question: "Can CALEHO Host handle more if my project grows?",
            answer:
                "Yes. Depending on your hosting requirements, you may upgrade to a hosting plan with additional resources and capabilities when your website or application grows.",
        },
        {
            question: "How much does CALEHO Host cost?",
            answer:
                "The cost depends on the hosting plan and services you choose. You can view the available hosting plans and their current pricing on the Hosting Plans section.",
        },
        {
            question: "Is my website data secure with CALEHO Host?",
            answer:
                "CALEHO Host applies security measures designed to help protect hosted websites and user information. Security also depends on proper application configuration, account security, and the technologies used by the customer.",
        },
        {
            question: "Can I use my own domain with CALEHO Host?",
            answer:
                "Yes. Supported hosting plans can allow you to connect your own domain by configuring the required DNS records and hosting settings.",
        },
        {
            question: "Can I use a CALEHO Host subdomain?",
            answer:
                "Yes. Where supported by your hosting plan, you can use a CALEHO Host subdomain to access your website without purchasing a separate domain.",
        },
        {
            question: "Can I host a Laravel application?",
            answer:
                "Yes, provided that your selected hosting environment supports the PHP version, database, extensions, server configuration, and other requirements needed by your Laravel application.",
        },
        {
            question: "Can I use a database for my website?",
            answer:
                "Yes. Supported hosting plans may include database services. The available database type, storage, and limits depend on your selected hosting plan.",
        },
        {
            question: "What happens if my hosting plan expires?",
            answer:
                "If your hosting plan expires and is not renewed, your hosting service may be suspended or restricted according to the applicable service terms.",
        },
        {
            question: "How can I contact CALEHO Host support?",
            answer: (
                <>
                    You can contact our support team directly at{" "}
                    <a
                        href="mailto:support@calehohost.com"
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
                    >
                        support@calehohost.com
                    </a>
                    .
                </>
            ),
        },
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section
            id="faqs"
            className="
                scroll-mt-16
                bg-white
                dark:bg-slate-950
                px-4
                py-20
                sm:px-6
                lg:px-8
                transition-colors
                duration-300
            "
        >
            <div className="mx-auto max-w-4xl">

                {/* =========================================
                    Header
                ========================================== */}
                <div className="text-center">
                    <h2
                        className="
                            text-4xl
                            font-semibold
                            tracking-tight
                            text-slate-900
                            dark:text-white
                            sm:text-5xl
                            lg:text-[52px]
                        "
                    >
                        CALEHO Host FAQs
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-2xl
                            text-base
                            leading-7
                            text-slate-600
                            dark:text-slate-400
                        "
                    >
                        Everything you need to know about CALEHO Host,
                        hosting, deployment, accounts, and our services.
                    </p>
                </div>

                {/* =========================================
                    FAQ List
                ========================================== */}
                <div className="mt-14">
                    {faqs.map((faq, index) => {
                        const isOpen = openFaq === index;

                        return (
                            <div
                                key={index}
                                className="
                                    border-b
                                    border-slate-200
                                    dark:border-slate-800
                                "
                            >
                                {/* Question */}
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(index)}
                                    className="
                                        group
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        gap-6
                                        py-6
                                        text-left
                                        transition-colors
                                    "
                                >
                                    <span
                                        className={`
                                            text-[15px]
                                            sm:text-base
                                            font-medium
                                            transition-colors
                                            duration-200
                                            ${
                                                isOpen
                                                    ? "text-blue-600 dark:text-blue-400"
                                                    : "text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                            }
                                        `}
                                    >
                                        {faq.question}
                                    </span>

                                    {/* Plus Icon */}
                                    <span
                                        className={`
                                            flex
                                            h-7
                                            w-7
                                            shrink-0
                                            items-center
                                            justify-center
                                            text-slate-700
                                            dark:text-slate-300
                                            transition-all
                                            duration-300
                                            ${
                                                isOpen
                                                    ? "rotate-45 text-blue-600 dark:text-blue-400"
                                                    : "rotate-0"
                                            }
                                        `}
                                    >
                                        <Plus className="h-5 w-5" strokeWidth={1.5} />
                                    </span>
                                </button>

                                {/* Answer */}
                                <div
                                    className={`
                                        grid
                                        transition-all
                                        duration-300
                                        ease-in-out
                                        ${
                                            isOpen
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                        }
                                    `}
                                >
                                    <div className="overflow-hidden">
                                        <div
                                            className="
                                                max-w-3xl
                                                pb-6
                                                pr-10
                                                text-sm
                                                leading-7
                                                text-slate-600
                                                dark:text-slate-400
                                            "
                                        >
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* =========================================
                    Bottom Support
                ========================================== */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Still have questions?
                    </p>

                    <a
                        href="mailto:support@calehohost.com"
                        className="
                            mt-2
                            inline-block
                            text-sm
                            font-medium
                            text-blue-600
                            hover:text-blue-500
                            dark:text-blue-400
                            dark:hover:text-blue-300
                            hover:underline
                            underline-offset-4
                            transition-colors
                        "
                    >
                        Contact CALEHO Host Support
                    </a>
                </div>
            </div>
        </section>
    );
}