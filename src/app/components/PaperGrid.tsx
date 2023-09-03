import PaperCard from "./PaperCard";
import { atom, useAtom } from "jotai";

interface PaperGridProps {
  examPaperList: string[][];
}

let shareIsOpenAtom = atom(false)
let resourcesIsOpenAtom = atom(false)

function PaperGrid({ examPaperList }: PaperGridProps) {

  let [, setShareIsOpen] = useAtom(shareIsOpenAtom)
  let [, setResourcesIsOpen] = useAtom(resourcesIsOpenAtom)

  const years: string[] = [];
  for (const element of examPaperList) {
    const year = element[3]
    if (!(years.includes(year))) {
      years.push(year);
    }
  }

  if (years.length == 1) {
    const deferredPapers = examPaperList.filter((paper) =>
      paper[0].includes("deferred")
    );
    const nonDeferredPapers = examPaperList.filter(
      (paper) => !paper[0].includes("deferred")
    );

    return (
      <div className="justify-center items-center flex flex-col">

        <hr className="block mt-6 mb-4 border-white/50 border-dashed h-[1px] w-full" />

        <div className="flex flex-row flex-wrap gap-x-4 justify-center">
          <button
            className="mb-5 whitespace-nowrap w-min
                    bg-zinc-900 p-3 rounded-lg border-[#303436] border-2 text-white            
                    "
            onClick={() => setShareIsOpen(true)}
          >
            Share Links
          </button>

          <button
            className="mb-5 whitespace-nowrap w-min
                    bg-zinc-900 p-3 rounded-lg border-[#303436] border-2 text-white            
                    "
            onClick={() => setResourcesIsOpen(true)}
          >
            {examPaperList[0][1]} Resources
          </button>
        </div>
        {
          nonDeferredPapers.length > 0 && (
            <div className="flex flex-row flex-wrap gap-8 justify-center">
              {nonDeferredPapers.map((paper, index) => (
                <PaperCard
                  key={
                    paper[0] +
                    paper[1] +
                    paper[2] +
                    paper[3] +
                    index
                  }
                  type={paper[0]}
                  subject={paper[1]}
                  paperName={paper[2]}
                  year={paper[3]}
                  url={paper[4]}
                />
              ))}
            </div>
          )
        }

        {
          deferredPapers.length > 0 && (
            <>
              <div className="flex flex-row flex-wrap gap-8 mt-12 justify-center">
                {deferredPapers.map((paper, index) => (
                  <PaperCard
                    key={
                      paper[0] +
                      paper[1] +
                      paper[2] +
                      paper[3] +
                      index
                    }
                    type={paper[0]}
                    subject={paper[1]}
                    paperName={paper[2]}
                    year={paper[3]}
                    url={paper[4]}
                  />
                ))}
              </div>
            </>
          )
        }
      </div >
    );
  } else {
    return (
      <div className="justify-center max-w-[85rem]">
        {
          years.map((yr: string) => (
            <div className="flex flex-col flex-wrap" key={yr}>
              <h1 className="text-white text-3xl ml-4 mt-6">{yr}</h1>
              <hr />
              <div className="flex flex-row flex-wrap gap-8 mt-8 justify-center">
                {
                  examPaperList.filter((paper) => paper[3].includes(yr)).map((paper, index) => (
                    <PaperCard
                      key={
                        paper[0] +
                        paper[1] +
                        paper[2] +
                        paper[3] +
                        index
                      }
                      type={paper[0]}
                      subject={paper[1]}
                      paperName={paper[2]}
                      year={paper[3]}
                      url={paper[4]}
                    />

                  ))
                }
              </div>
            </div>
          )
          )
        }
      </div >
    )
  }
}

export { shareIsOpenAtom, resourcesIsOpenAtom };
export default PaperGrid;
