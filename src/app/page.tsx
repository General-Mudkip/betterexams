"use client";
import AboutDialog from "./components/Dialogs/AboutDialog";
import ContactDialog from "./components/Dialogs/ContactDialog";
import Footer from "./components/Footer";
import ChoicesForm from "./components/Form";

export default function Home() {
    return (
        <main className="min-h-screen h-full flex flex-col -mt-12 items-center p-24 lg:mt-0">
            <h1 className="text-6xl font-bold text-center">Better Exams</h1>
            <h2 className="italic text-white/70 mt-1 text-center">An Alternative To Examinations.ie</h2>

            <div className="text-slate-400 items-center h-full mt-8 md:mt-14">
                <ChoicesForm />
            </div>

            <div className="flex-grow mt-14" />
            <AboutDialog />
            <ContactDialog />
            <Footer />
        </main>
    );
}
