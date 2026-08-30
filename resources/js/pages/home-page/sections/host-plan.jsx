import { CheckCircle } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback, memo } from "react";

// Move static data out of the render pipeline entirely
const PLANS = [
  {
    name: "Student",
    subtitle: "For your very first site",
    price: "₱129",
    billingNote: "/month",
    annualNote: "or ₱1,000 billed annually",
    features: [
      "1 Site",
      "1 Free Subdomain",
      "50MB NVMe Storage",
      "1 MySQL Database (50MB)",
      "Automated Git Push Sync",
      "Free SSL",
    ],
    popular: false,
    cta: "Choose Plan",
  },
  {
    name: "Pro",
    subtitle: "For growing student projects",
    price: "₱249",
    billingNote: "/month",
    annualNote: "or ₱2,200 billed annually",
    features: [
      "3 Sites",
      "1 Free Subdomain",
      "200MB NVMe Storage",
      "1 MySQL Database (100MB)",
      "Automated Git Push Sync",
      "VS Code AI Extension (BYOK)",
      "Free SSL",
    ],
    popular: true,
    cta: "Choose Plan",
  },
  {
    name: "Enterprise",
    subtitle: "For organizations and capstone teams",
    price: "Custom",
    billingNote: "",
    annualNote: "Contact for pricing",
    features: [
      "Free Domain (1 Year)",
      "Automated Git + Priority Sync",
    ],
    popular: false,
    cta: "Contact Sales",
  },
];

const EXTENDED_PLANS = [...PLANS, ...PLANS, ...PLANS];
const TOTAL_COUNT = PLANS.length;

// Reusable Check Icon
const CheckIcon = () => (
  <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mr-3 shrink-0" />
);

// Isolated PlanCard component for memoization
const PlanCard = memo(({ plan, isActive, isSelected, onSelect, onFocusCard, cardIndex, slideWidthPct }) => {
  return (
    <div className="shrink-0 px-3" style={{ width: `${slideWidthPct}%` }}>
      <div
        onClick={() => { if (!isActive) onFocusCard(cardIndex); }}
        className={`bg-white dark:bg-slate-900 rounded-2xl p-8 flex flex-col border relative border-slate-200 dark:border-slate-800 min-h-[520px] h-full transition-all duration-300 hover:-translate-y-1 ${
          isActive ? "border-2 !border-blue-500 dark:!border-blue-500 shadow-2xl scale-[1.03] z-10" : "shadow-md cursor-pointer"
        }`}
      >
        <div className="flex justify-between items-start min-h-[64px] mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium leading-snug mt-1">{plan.subtitle}</p>
          </div>
          {plan.popular && (
            <span className="bg-blue-600 dark:bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              Most Popular
            </span>
          )}
        </div>

        <div className="my-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
            {plan.billingNote && (
              <span className="text-slate-400 dark:text-slate-500 text-sm font-medium ml-1">{plan.billingNote}</span>
            )}
          </div>
          {plan.annualNote && (
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">{plan.annualNote}</p>
          )}
        </div>

        <ul className="space-y-4 mb-8 flex-grow">
          {plan.features.map((feature, fIndex) => (
            <li key={fIndex} className="flex items-center text-sm text-slate-600 dark:text-slate-300 font-medium">
              <CheckIcon />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(plan.name); }}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${
              isActive ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {isSelected && <CheckIcon />}
            {isSelected ? "Selected" : plan.cta}
          </button>
        </div>
      </div>
    </div>
  );
});

export default function HostPlan() {
  const [visible, setVisible] = useState(3);
  const [index, setIndex] = useState(TOTAL_COUNT);
  const [withTransition, setWithTransition] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const isAnimating = useRef(false);
  const centerOffsetRef = useRef(Math.floor((3 - 1) / 2));

  // Handle dynamic sizing efficiently, debounced to avoid thrashing on resize
  useEffect(() => {
    let resizeTimer;
    const applySize = () => {
      const width = window.innerWidth;
      if (width < 768) setVisible(1);
      else if (width < 1280) setVisible(2);
      else setVisible(3);
    };
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applySize, 150);
    };

    applySize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const goNext = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setWithTransition(true);
    setIndex((i) => i + 1);
  }, []);

  const goPrev = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setWithTransition(true);
    setIndex((i) => i - 1);
  }, []);

  const goTo = useCallback((dotIndex) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setWithTransition(true);
    setIndex(TOTAL_COUNT + dotIndex - centerOffsetRef.current);
  }, []);

  // Clicking a non-centered card brings it into focus, same as the arrow buttons.
  const goToCard = useCallback((extendedIndex) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setWithTransition(true);
    setIndex(extendedIndex - centerOffsetRef.current);
  }, []);

  // Only react to the container's own transform transition, not bubbled
  // transitions from card hover/selection effects inside it.
  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;

    isAnimating.current = false;
    if (index >= TOTAL_COUNT * 2) {
      setWithTransition(false);
      setIndex((i) => i - TOTAL_COUNT);
    } else if (index < TOTAL_COUNT) {
      setWithTransition(false);
      setIndex((i) => i + TOTAL_COUNT);
    }
  };

  // Instant (non-animated) jumps never fire transitionend, so clear the lock manually.
  useEffect(() => {
    if (!withTransition) isAnimating.current = false;
  }, [withTransition]);

  const handleSelectPlan = useCallback((planName) => {
    setSelectedPlan((prev) => (prev === planName ? null : planName));
  }, []);

  const centerOffset = Math.floor((visible - 1) / 2);
  centerOffsetRef.current = centerOffset;
  const centeredExtendedIndex = index + centerOffset;
  const activeDot = ((centeredExtendedIndex % TOTAL_COUNT) + TOTAL_COUNT) % TOTAL_COUNT;
  const slideWidthPct = 100 / visible;

  return (
    <div id="hosting-plans" className="scroll-mt-16 bg-white dark:bg-slate-950 transition-colors duration-200">
    <div className="py-16 px-6 max-w-[1600px] mx-auto text-slate-800 dark:text-slate-100">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Choose the right hosting plan for you
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
          Affordable hosting plans designed to help students start, learn, build, and grow online.
        </p>
      </div>

      <div
        className="relative"
      >
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous plan"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next plan"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="overflow-x-hidden overflow-y-visible py-3 -my-3">
          <div
            onTransitionEnd={handleTransitionEnd}
            className={`flex items-stretch ${withTransition ? "transition-transform duration-500 ease-in-out" : ""}`}
            style={{ transform: `translateX(-${index * slideWidthPct}%)` }}
          >
            {EXTENDED_PLANS.map((plan, i) => {
              const isSelected = selectedPlan === plan.name;
              const isActive = selectedPlan ? isSelected : i === centeredExtendedIndex;

              return (
                <PlanCard
                  key={i}
                  plan={plan}
                  isActive={isActive}
                  isSelected={isSelected}
                  onSelect={handleSelectPlan}
                  onFocusCard={goToCard}
                  cardIndex={i}
                  slideWidthPct={slideWidthPct}
                />
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {PLANS.map((plan, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              aria-label={`Go to ${plan.name}`}
              onClick={() => goTo(dotIndex)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                dotIndex === activeDot ? "w-8 bg-blue-600 dark:bg-blue-500" : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}