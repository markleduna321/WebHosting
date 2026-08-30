import React from "react";
import Layout from "../layout";
import Card from "../../_components/card";

export default function Page() {
  const plans = [
    {
      name: "Starter",
      description: "For your very first site",
      price: "₱49",
      period: "/mo",
      features: [
        "1 Website",
        "5 GB SSD Storage",
        "50 GB Bandwidth",
        "Free SSL",
        "Student Support",
      ],
      buttonText: "Switch to Starter",
      isCurrent: false,
    },
    {
      name: "Student",
      description: "Coursework and portfolios",
      price: "₱99",
      period: "/mo",
      features: [
        "3 Websites",
        "15 GB SSD Storage",
        "100 GB Bandwidth",
        "Free SSL",
        "Free Domain",
      ],
      buttonText: "Switch to Student",
      isCurrent: false,
    },
    {
      name: "Student Pro",
      description: "Everything a busy student needs",
      price: "₱199",
      period: "/mo",
      features: [
        "10 Websites",
        "30 GB SSD Storage",
        "Unlimited Bandwidth",
        "Free SSL",
        "Free Domain",
      ],
      buttonText: "Active plan",
      isCurrent: true,
    },
    {
      name: "Developer",
      description: "Ship real apps with Git",
      price: "₱299",
      period: "/mo",
      features: [
        "Unlimited Websites",
        "50 GB SSD Storage",
        "Unlimited Bandwidth",
        "Free SSL",
        "Free Domain",
      ],
      buttonText: "Switch to Developer",
      isCurrent: false,
    },
    {
      name: "Project Hosting",
      description: "Capstones and org platforms",
      price: "₱399",
      period: "/mo",
      features: [
        "Unlimited Websites",
        "100 GB SSD Storage",
        "Unlimited Bandwidth",
        "Free SSL",
        "Multiple Databases",
      ],
      buttonText: "Switch to Project Hosting",
      isCurrent: false,
    },
  ];

  return (
    <Layout title="Hosting Plan" subtitle="Compare and switch your hosting plan">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card
            key={index}
            variant={plan.isCurrent ? "primary" : "default"}
            outlined={plan.isCurrent}
            padding="p-6"
            className={`justify-between h-full bg-white cursor-default hover:shadow-none ${
              plan.isCurrent ? "border-blue-500 border-2" : "border-gray-200"
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-400">{plan.description}</p>
                </div>
                {plan.isCurrent && (
                  <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Current
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div className="my-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>

              <hr className="border-gray-100 my-4" />

              {/* Features List */}
              <ul className="space-y-3 my-6 text-xs text-slate-600">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <button
              className={`w-full py-2.5 rounded-md text-xs font-semibold transition ${
                plan.isCurrent
                  ? "border border-gray-200 text-gray-500 cursor-not-allowed bg-transparent"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={plan.isCurrent}
            >
              {plan.buttonText}
            </button>
          </Card>
        ))}
      </div>
    </Layout>
  );
}