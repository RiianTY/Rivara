import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { ContactButton } from "@/components/contact-button";

// Lazy-load heavy homepage sections to keep first paint lighter.
const ASCIIAnimation = lazy(() => import("@/components/ascii"));
const Cards = lazy(() => import("@/components/cards"));
const Pricing = lazy(() => import("@/components/pricing"));

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
};

export default function IndexPage() {
  const [showHeroAnimation, setShowHeroAnimation] = useState(false);
  const [showLowerSections, setShowLowerSections] = useState(false);
  const lowerSectionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Defer non-critical hero animation work until after initial paint.
    const timerId = window.setTimeout(() => {
      setShowHeroAnimation(true);
      void import("@/components/ascii");
      void import("@/components/cards");
      void import("@/components/pricing");
    }, 250);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (!lowerSectionsRef.current || showLowerSections) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowLowerSections(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(lowerSectionsRef.current);

    return () => observer.disconnect();
  }, [showLowerSections]);

  return (
    <DefaultLayout>
      <motion.header
        animate="visible"
        className="flex flex-col items-center mt-32"
        initial="hidden"
        variants={variants}
      >
        <div key={1} className="inline-block max-w-lg text-center max-w-md">
          <h1 className={title()}>
            Welcome to&nbsp;
            <span className={title({ color: "cyan" })}>Rivara&nbsp;</span>
            <br />
            Web solutions for everyone
          </h1>

          <h2 className={subtitle({ class: "mt-4" })}>
            Modernising your business made easy
            <ContactButton />
          </h2>
        </div>

        {/* ASCII globe - fixed size container so art doesn't scale when section spacing changes */}
      </motion.header>
      <motion.div
        key={2}
        className="w-full flex justify-center shrink-0 h-[25vh] md:h-[35vh] lg:h-[40vh]"
        variants={childVariants}
      >
        <Suspense
          fallback={
            <div className="w-full h-full animate-pulse rounded-lg bg-default-100" />
          }
        >
          {showHeroAnimation ? (
            <ASCIIAnimation
              className="w-full h-full"
              fps={20}
              frameCount={300}
              frameFolder="animation/planet"
              lazy={true}
              quality="high"
            />
          ) : (
            <div className="w-full h-full animate-pulse rounded-lg bg-default-100" />
          )}
        </Suspense>
      </motion.div>

      <div ref={lowerSectionsRef} className="w-full min-h-[420px]">
        {showLowerSections ? (
          <motion.div key={4} variants={childVariants}>
            <Suspense
              fallback={
                <div className="w-full py-12 bg-default-50 animate-pulse" />
              }
            >
              <Cards />
              <Pricing />
            </Suspense>
          </motion.div>
        ) : (
          <div className="w-full py-12 bg-default-50 animate-pulse" />
        )}
      </div>
    </DefaultLayout>
  );
}
