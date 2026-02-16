import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AppShowcase from "@/components/AppShowcase";
import AuthorsSection from "@/components/AuthorsSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
    return (
        <main className="overflow-x-hidden">
            <Navbar />
            <HeroSection />
            <AppShowcase />
            <AuthorsSection />
            <FooterSection />
        </main>
    );
};

export default Index;
