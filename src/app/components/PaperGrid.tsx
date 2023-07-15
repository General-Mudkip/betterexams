import PaperCard from "./PaperCard";

interface PaperGridProps {
    examPaperList: string[][];
}

function PaperGrid({ examPaperList }: PaperGridProps) {

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
            <div className="mt-8 justify-center">
                {nonDeferredPapers.length > 0 && (
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
                )}

                {deferredPapers.length > 0 && (
                    <>
                        <hr className="mt-8 border-dashed"></hr>
                        <div className="flex flex-row flex-wrap gap-8 mt-8 justify-center">
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
                )}
            </div>
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
export default PaperGrid;
