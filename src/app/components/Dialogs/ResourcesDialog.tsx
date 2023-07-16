import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { resourcesIsOpenAtom } from "../PaperGrid"
import { selectionArrayAtom } from "../Form"
import ReactMarkdown from "react-markdown";
import { useState } from "react";

function ResourcesDialog() {
  let [aboutIsOpen, setAboutIsOpen] = useAtom(resourcesIsOpenAtom);
  let [selectionArray,] = useAtom(selectionArrayAtom);


  var data = require('../../files/data.json');
  var subNumsToNames = data["subNumsToNames"]

  const subjectNumber = selectionArray[1]

  const markdownPath = `/resources/${subjectNumber}.md`
  const universalPath = "/resources/universal.md"

  let [markdownText, setMarkdownText] = useState("");

  const fetchMarkdownText = async () => {
    try {
      const response = await fetch(markdownPath)
      const uResponse = await fetch(universalPath)
      const rText = await response.text()
      const uText = await uResponse.text()
      setMarkdownText(uText + rText)
      console.log(response)
      if (rText === "") {
        setMarkdownText("Nothing for this subject found. Contribute via the form below! :)")
      }
    } catch (error) {
      setMarkdownText("We ran into an error! Please contact me using the form in the footer. Thanks :)\n\n\n" + error)
    }
  }


  fetchMarkdownText()

  return (
    <AnimatePresence>
      {aboutIsOpen && (
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
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Dialog.Panel className="w-[32rem] p-8 rounded-2xl border-4 border-white bg-zinc-950">
                  <Dialog.Title className="text-3xl font-bold">{subNumsToNames[subjectNumber]} Resources</Dialog.Title>
                  <Dialog.Description>
                    <span className="italic text-slate-400">Feel free to contribute any links via the form below.</span>
                    <div className="mt-6">
                      <ReactMarkdown className="prose prose-p:-mt-4 prose-hr:my-6 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h3:text-lg prose-h3:font-bold prose-a:font-normal prose-a:text-white hover:prose-a:text-slate-300 prose-invert">
                        {markdownText}
                      </ReactMarkdown>
                    </div>

                  </Dialog.Description>

                  <button onClick={() => setAboutIsOpen(false)} className="mt-4 rounded-md p-2 hover:scale-105">Close</button>
                </Dialog.Panel>
              </div>
            </div>
          </motion.div>
        </Dialog>

      )}
    </AnimatePresence>
  );
}

export default ResourcesDialog;
