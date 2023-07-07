import { Dialog } from "@headlessui/react";
import { atom, useAtom } from "jotai";
import { AnimatePresence, motion } from "framer-motion";

let aboutIsOpenAtom = atom(false);
let contactIsOpenAtom = atom(true);

const WEBHOOK_URL:string = "https://webhook.site/38b5a909-1a34-4ad4-80b9-90c9b71fe573";

function Footer() {
    function AboutDialog() {
        let [aboutIsOpen, setAboutIsOpen] = useAtom(aboutIsOpenAtom);

        return (
            <AnimatePresence>
                { aboutIsOpen && (
                
                    <Dialog
                        open={aboutIsOpen}
                        onClose={() => setAboutIsOpen(false)}
                        className="absolute z-50 w-full h-full"
                    >
                            
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="fixed h-full w-full inset-0 flex items-center justify-center p-4">
                                <Dialog.Panel className="w-[32rem] p-8 rounded-2xl border-4 border-white bg-zinc-950">
                                    <Dialog.Title className="text-3xl font-bold">About</Dialog.Title>
                                    <Dialog.Description>
                                        <h1 className="font-bold mt-4">What?</h1>
                                            <p>
                                                I created this site as an alternative to the official <a href="https://www.examinations.ie/" target="_blank" className="underline hover:decoration-2">examinations.ie</a> website, which is an arguable affront to God. (It proudly displays an e-Government award from 2006. It is as old as I am.)
                                            </p>
                                        <h1 className="font-bold mt-4">Why?</h1>
                                            <p>
                                                The goal from the get-go was to, firstly, improve upon my web-dev skills, and secondly, to save those precious seconds you spend every day on that hellish site.
                                            </p>
                                        <h1 className="font-bold mt-4">Who?</h1>
                                            <p> 
                                                This website was made by <a href="https://www.mudkip.live" target="_blank" className="underline hover:decoration-2">Bence R</a>
                                                , with heavy inspiration from Thomas Forbes&apos; &ldquo;<a href="https://examfinder.ie/" target="_blank" className="underline hover:decoration-2">examfinder.ie</a>&ldquo;. Many thanks to him for the advice and for allowing me to use his data.json file.
                                            </p>
                                    </Dialog.Description>

                                    <button onClick={() => setAboutIsOpen(false)} className="mt-4 rounded-md p-1 hover:scale-105">Close</button>
                                </Dialog.Panel>
                            </div>
                        </motion.div>
                    </Dialog>
                
                )}
            </AnimatePresence>
        );
    }


    function ContactDialog() {
        let [contactIsOpen, setContactIsOpen] = useAtom(contactIsOpenAtom);

        function sendMessageToDiscord(name: string, email: string, message: string) {
            const payload = {
                username: "Exam Help Bot",
                content: `**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}`,
            };

            fetch(WEBHOOK_URL, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),    
            }
            ).then(() => {
                alert("Message sent!");
            }).catch(error => {
                alert("Message failed to send! Please try again later.");
                console.error(error);
            });
        }

        const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const form = event.currentTarget;
            const formData = new FormData(form);

            const nameValue = formData.get("name");
            const emailValue = formData.get("email");
            const messageValue = formData.get("message");

            if (messageValue === "") {
                alert("Please include a message!");
                return;
            } else {
                sendMessageToDiscord(nameValue as string, emailValue as string, messageValue as string);
            }
        }

        return (
            <AnimatePresence>
                { contactIsOpen && (
                    <Dialog
                        open={contactIsOpen}
                        onClose={() => setContactIsOpen(false)}
                        className="absolute z-50 w-full h-full"
                    >
                            
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="fixed h-full w-full inset-0 flex items-center justify-center p-4">
                                <Dialog.Panel className="w-[32rem] p-8 rounded-2xl border-4 border-white bg-zinc-950">
                                    <Dialog.Title className="text-3xl font-bold">Contact</Dialog.Title>
                                    <Dialog.Description>
                                        <h1 className="font-bold mt-4">Want to reach out?</h1>
                                    </Dialog.Description>

                                    <form onSubmit={handleFormSubmit}> 
                                        <div className="flex flex-col space-y-2 mt-4">

                                            <label htmlFor="name" className="font-bold">Name</label>
                                            <input type="text" name="name" id="name" className="rounded-md p-1 pl-2 bg-zinc-900" />

                                            <label htmlFor="email" className="font-bold">Email</label>
                                            <input type="email" name="email" id="email" className="rounded-md p-1 pl-2 bg-zinc-900" />

                                            <label htmlFor="message" className="font-bold">Message</label>
                                            <textarea name="message" id="message" className="rounded-md p-1 pl-2 bg-zinc-900" />

                                            <button 
                                                type="submit"
                                                className="rounded-md p-1 bg-blue-400 hover:bg-blue-500 transition-all duration-300"
                                            >
                                                Submit
                                            </button>
                                        </div>

                                    </form>

                                    <button onClick={() => setContactIsOpen(false)} className="mt-4 rounded-md p-1 hover:scale-105">Close</button>
                                </Dialog.Panel>
                            </div>
                        </motion.div>
                    </Dialog>
                )}
            </AnimatePresence>
        )
    }

    function Footer() {
        let [aboutIsOpen, setAboutIsOpen] = useAtom(aboutIsOpenAtom);
        let [contactIsOpen, setContactIsOpen] = useAtom(contactIsOpenAtom);

        return (
            <footer className="flex flex-col items-center">
                <div className="flex w-full flex-row flex-wrap items-center justify-center space-x-2 text-center">
                    <a
                        onClick={() => setAboutIsOpen(true)}
                        className="group cursor-pointer text-blue-400 hover:text-blue-500 transition-all duration-300"
                    >
                        About
                        <span className="block max-w-0 bg-blue-400 group-hover:max-w-full transition-all duration-300 h-0.5 group-hover:bg-blue-500"></span>
                    </a>

                    <p>•</p>

                    <a
                        onClick={() => setContactIsOpen(true)}
                        className="group cursor-pointer text-red-400 hover:text-red-500"
                    >
                        Contact
                        <span className="block max-w-0 bg-red-400 group-hover:max-w-full transition-all duration-300 h-0.5 group-hover:bg-red-500"></span>
                    </a>

                    <a
                        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        className="text-white hover:text-red-500 transition-all duration-300"
                    >
                        •
                    </a>

                    <a
                        href="https://github.com/General-Mudkip/exam-help-tests"
                        target="_blank"
                        className="group cursor-pointer text-green-400 hover:text-green-500"
                    >
                        GitHub
                        <span className="block max-w-0 bg-green-400 group-hover:max-w-full transition-all duration-300 h-0.5 group-hover:bg-green-500"></span>
                    </a>
                </div>
            </footer>
        );
    }

    // TODO: Sort this out with jotai or smth
    return(
        <div>
            <AboutDialog />
            <ContactDialog />
            <Footer />
        </div>
    )
}

export default Footer;
