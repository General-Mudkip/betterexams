import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { shareIsOpenAtom } from "../PaperGrid"
import { selectionArrayAtom } from "../Form"

function ShareDialog() {
    let [shareIsOpen, setShareIsOpen] = useAtom(shareIsOpenAtom);
    let [selectionArray, setSelectionArray] = useAtom(selectionArrayAtom);

    let shareUrl = `localhost:3000?cert=${selectionArray[0]}&subject=${selectionArray[1]}&year=${selectionArray[2]}&lang=${selectionArray[3]}&level=${selectionArray[4]}`

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text)
            .then(() => {
                const copyButton = document.getElementById("copybutton");
                if (copyButton) {
                    copyButton.textContent = "Copied!"

                    setTimeout(() => {
                        copyButton.textContent = "Copy";
                    }, 1000)
                }
            })
            .catch((error) => {
                console.error("Failed to copy to clipboard: ", error)
            })
    }

    return (
        <AnimatePresence>
            {shareIsOpen && (
                <Dialog
                    open={shareIsOpen}
                    onClose={() => setShareIsOpen(false)}
                    className="absolute z-50 w-full h-full"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <Dialog.Panel className="w-[32rem] p-8 rounded-2xl border-4 border-white bg-zinc-950">
                                    <Dialog.Title className="text-3xl font-bold">Share</Dialog.Title>
                                    <Dialog.Description>
                                        <h3 className="text-sm text-slate-300 italic">Want to share your current selection with someone else?</h3>
                                        <h2 className="mb-2 text-xl mt-4">Shareable Link:</h2>
                                        <div className="bg-zinc-900 border-2 p-2 rounded-md border-white items-center flex">
                                            <span className="flex-grow-0 truncate">
                                                {shareUrl}
                                            </span>

                                            <button className="border-2 border-white p-2 rounded-md" id="copybutton" onClick={() => copyToClipboard(shareUrl)}>
                                                Copy
                                            </button>
                                        </div>
                                    </Dialog.Description>

                                    <button onClick={() => setShareIsOpen(false)} className="mt-4 rounded-md p-2 hover:scale-105">Close</button>
                                </Dialog.Panel>

                            </div>
                        </div>
                    </motion.div>
                </Dialog>
            )
            }
        </AnimatePresence >
    )
}

export default ShareDialog;
