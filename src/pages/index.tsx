import { lazy, Suspense } from "react";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { ContactButton } from "@/components/contact-button";

const ASCIIAnimation = lazy(() => import("@/components/ascii"));
const Cards = lazy(() => import("@/components/cards"));
const Pricing = lazy(() => import("@/components/pricing"));

export default function IndexPage() {
  return (
    <DefaultLayout>
      <header className="flex flex-col items-center mt-32 animate-hero-slide">
        <div className="inline-block max-w-lg text-center max-w-md">
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
      </header>

      <div className="w-full flex justify-center shrink-0 h-[25vh] md:h-[35vh] lg:h-[40vh]">
        <Suspense
          fallback={
            <div className="w-full h-full animate-pulse rounded-lg bg-default-100" />
          }
        >
          <ASCIIAnimation
            className="w-full h-full"
            fps={20}
            frameCount={300}
            frameFolder="animation/planet"
            lazy={true}
            quality="high"
          />
        </Suspense>
      </div>

      <Suspense
        fallback={<div className="w-full py-12 bg-default-50 animate-pulse" />}
      >
        <Cards />
        <Pricing />
      </Suspense>
    </DefaultLayout>
  );
}
