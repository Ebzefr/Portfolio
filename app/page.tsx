import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Guestbook from "@/components/guestbook/Guestbook";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Skills />
      <Contact />
      <Guestbook />
      <footer className="site-footer">
        <p>Copyright &copy; {new Date().getFullYear()} Ebenezer. All Rights Reserved.</p>
      </footer>
    </>
  );
}
