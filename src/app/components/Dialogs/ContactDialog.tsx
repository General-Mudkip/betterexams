import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { contactIsOpenAtom } from "../Footer";

const WEBHOOK_URL:string = "https://webhook.site/38b5a909-1a34-4ad4-80b9-90c9b71fe573";

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
            alert("Message failed to send! Feel free to email me at generalmudkipp@gmail.com");
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

                                <button onClick={() => setContactIsOpen(false)} className="mt-4 rounded-md p-2 hover:scale-105">Close</button>
                            </Dialog.Panel>
                        </div>
                    </motion.div>
                </Dialog>
            )}
        </AnimatePresence>
    )
}

export default ContactDialog;