export const PASSWORD_RULES = [
    {
        key: "length",
        label: "At least 8 characters",
        test: (value) => value.length >= 8,
    },
    {
        key: "uppercase",
        label: "One uppercase letter (A-Z)",
        test: (value) => /[A-Z]/.test(value),
    },
    {
        key: "lowercase",
        label: "One lowercase letter (a-z)",
        test: (value) => /[a-z]/.test(value),
    },
    {
        key: "number",
        label: "One number (0-9)",
        test: (value) => /[0-9]/.test(value),
    },
    {
        key: "special",
        label: "One special character (!@#$...)",
        test: (value) => /[^A-Za-z0-9]/.test(value),
    },
];

export function evaluatePassword(value = "") {
    const results = PASSWORD_RULES.map((rule) => ({
        key: rule.key,
        label: rule.label,
        passed: rule.test(value),
    }));

    const passedCount = results.filter((result) => result.passed).length;

    return {
        results,
        passedCount,
        isValid: passedCount === PASSWORD_RULES.length,
    };
}

export function getStrength(passedCount) {
    if (passedCount <= 2) {
        return {
            label: "Weak",
            textClass: "text-red-600",
            barClass: "bg-red-500",
            filledSegments: 1,
        };
    }

    if (passedCount === 3) {
        return {
            label: "Fair",
            textClass: "text-amber-600",
            barClass: "bg-amber-500",
            filledSegments: 2,
        };
    }

    if (passedCount === 4) {
        return {
            label: "Good",
            textClass: "text-blue-600",
            barClass: "bg-blue-500",
            filledSegments: 3,
        };
    }

    return {
        label: "Strong",
        textClass: "text-emerald-600",
        barClass: "bg-emerald-500",
        filledSegments: 4,
    };
}
