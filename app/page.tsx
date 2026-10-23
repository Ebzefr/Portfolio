import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Skills />
      <Contact />
      <footer className="site-footer">
        <p>Copyright &copy; {new Date().getFullYear()} Ebzé. All Rights Reserved.</p>
      </footer>
    </>
  );
}
