import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { shareIsOpenAtom } from "../PaperGrid"
import { selectionArrayAtom } from "../Form"

function ShareDialog() {
    let [shareIsOpen, setShareIsOpen] = useAtom(shareIsOpenAtom);
    let [selectionArray, setSelectionArray] = useAtom(selectionArrayAtom);

    let shareUrl = `localhost:3000?cert=${selectionArray[0]}&subject=${selectionArray[1]}&year=${selectionArray[2]}&lang=${selectionArray[3]}&level=${selectionArray[4]}`

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
                                        <a href={shareUrl}>
                                            {shareUrl}
                                        </a>
                                    </Dialog.Description>

                                    <button onClick={() => setShareIsOpen(false)} className="mt-4 rounded-md p-2 hover:scale-105">Close</button>
                                </Dialog.Panel>

                            </div>
                        </div>
                    </motion.div>
                </Dialog>
            )}
        </AnimatePresence>
    )
}

export default ShareDialog;
