import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import DemoCTA from "@/components/DemoCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <Benefits />
      <DemoCTA />
      <Footer />
    </main>
  );
}
