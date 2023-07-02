'use client'
import { useState, ChangeEvent, useEffect } from 'react';
import PaperGrid from './PaperGrid';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

// INITIALISATION
var data = require('../files/data.json');
var subNumsToNames = data["subNumsToNames"]

const url: string = "https://www.examinations.ie/archive";

function ChoicesForm() {
    const [certificate, setCertificate] = useState<string>('lc');
    const [subject, setSubject] = useState<string>('2');
    const [year, setYear] = useState<string>('2019');
    const [language, setLanguage] = useState<string>('EV');
    const [level, setLevel] = useState<string>('Higher');

    const [englishDisabled, setEnglishDisabled] = useState<boolean>(false);
    const [irishDisabled, setIrishDisabled] = useState<boolean>(true);

    const[higherDisabled, setHigherDisabled] = useState<boolean>(false);
    const[ordinaryDisabled, setOrdinaryDisabled] = useState<boolean>(false);
    const[foundationDisabled, setFoundationDisabled] = useState<boolean>(false);
    const[commonDisabled, setCommonDisabled] = useState<boolean>(false);

    const [examList, setExamList] = useState<string[][]>([]);

    let tempExamList:string[][]; // To be used because of useState's asynchronity
    let currentLevel: string = "Higher";

    let tempSubject:string = subject;

    let tempHigherDisabled: boolean = false;
    let tempOrdinaryDisabled: boolean = false;
    let tempFoundationDisabled: boolean = false;
    let tempCommonDisabled: boolean = false;

    determineLevelAvailability()    

    type ExamPaper = {
        details: string;
        url: string;
      };

    useEffect(() => {
        determineLanguageAvailability();
        determineLevelAvailability();
    }, [certificate, subject, year]);

    useEffect(() => {
        grabExamUrls(certificate, subject, year, language, level); // Sets up examList
    }, [certificate, subject, year, language, level, englishDisabled, irishDisabled]);
      
    // Adds the exam link to the list of exam papers (TEMPORARY)
    function addExamToList(subjectId:string, examName: string, examUrl: string, category: string, year: string) {

        let fullExamUrl:string = `${url}/${category}/${year}/${examUrl}`

        tempExamList.push([category, data["subNumsToNames"][subjectId], examName, year, fullExamUrl])

    }

    // Returns a list of exam papers for a given subject, year, language, and level.
    function grabExamUrls(cert: string, subjectId: string, year: string, language:string, level: string) {
        
        tempExamList = []; // Resets the temporary exam list

        if (englishDisabled) {
            setLanguage("IV");
        } else if (irishDisabled) {
            setLanguage("EV");
        }

        determineLevelAvailability()

        let documentList = data[cert][subjectId][year]; // Navigates to the specific subject and year.
        let categories = Object.keys(documentList); // exampapers, marking schemes, etc.
      
        for (const cat of categories) {
            for (const doc of documentList[cat]) {
                let docName = doc["details"];
                let docUrl = doc["url"];

                if ((docName.includes(language) || docName.includes("BV") || docName.includes("File") || docName.includes("Picture") || docName.includes("Map") || docName.includes("Source")) && (docName.includes(level) || docName.includes("Common") || docName.includes("File"))) {
                    if (!(!(level == "Foundation") && docName.includes("Foundation") && docName.includes("File"))) { // Ensures that the Foundation level sound file isn't added to the list when a level other than Foundation is selected.
                        
                        if(!(documentList["exampapers"].some((paperName: ExamPaper) => paperName.details.includes("Foundation") && !(docName.includes("Foundation")) && level == "Foundation"))) { // Sorry if you're reading this. Fix to an obscure bug where Sound Files from both Higher/Ordinary and Foundation would be included when "Foundation" was selected.
                            addExamToList(subjectId, docName, docUrl, cat, year);
                        }
                        
                    }
                }
            }
        }

        setExamList(tempExamList); // Sets the exam list to the newly generated list
    }

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const name = event.target.name;
        const value = event.target.value;

        // Update the corresponding state hook based on the name
        switch (name) {
            case 'certificate':
                setCertificate(value);
                setSubject(Object.keys(subNumsToNames)[0]); // Reset the subject to the first available option
                // Call subjectChoiceLoad to update the subject options
                break;
            case 'subject':
                setSubject(value);

                tempSubject = value;

                // Check if the selected year is valid for the new subject
                if (!data[certificate][value].hasOwnProperty(year)) {
                    // If the selected year is invalid, update the year state
                    setYear(Object.keys(data[certificate][value])[0]);
                }

                handleLevelChange(currentLevel)
                break;
            case 'year':
                setYear(value);
                break;
            case 'language':
                setLanguage(value);
                break;
            case 'level':
                setLevel(value);
                break;
            default:
                break;
        }
    };

    const handleLevelChange = (value: string) => {
        currentLevel = value;
        determineLevelAvailability();
        setCorrectLevel(currentLevel);
        setLevel(currentLevel)
    }

    function setCorrectLevel(curLevel: string) {
        if (curLevel === "Higher" && tempHigherDisabled) {
            setLevel("Ordinary");
        } else if (curLevel === "Ordinary" && tempOrdinaryDisabled) {
            setLevel("Higher");
        } else if (curLevel === "Foundation" && tempFoundationDisabled) {
            setLevel("Higher");
        } else if (curLevel === "Common" && tempCommonDisabled) {
            setLevel("Higher");
        } else {
            setLevel(curLevel);
        }
    }

    function determineLanguageAvailability() { // I promise this is the best way to do this

        const exampapers = data[certificate][subject][year]["exampapers"];
        setEnglishDisabled(true);
        setIrishDisabled(true);

        for (const doc of exampapers) {
            const docName = doc.details;
            if (docName.includes("EV")) {
                setEnglishDisabled(false);
            }
            if (docName.includes("IV")) {
                setIrishDisabled(false);
            }
        }
    }

    function determineLevelAvailability() {
        const exampapers = data[certificate][tempSubject][year]["exampapers"];

        tempHigherDisabled = true;
        tempOrdinaryDisabled = true;
        tempFoundationDisabled = true;
        tempCommonDisabled = true;

        for (const doc of exampapers) {
            const docName = doc.details;
            if (!(docName.includes("Map") || docName.includes("Illustration"))) { // Prevents common level material (e.g Maps in geography) from enabling Common level
                if (docName.includes("Higher")) {
                    tempHigherDisabled = false;
                }
                if (docName.includes("Ordinary")) {
                    tempOrdinaryDisabled = false;
                }
                if (docName.includes("Foundation")) {
                    tempFoundationDisabled = false;
                }
                if (docName.includes("Common")) {
                    tempCommonDisabled = false;
                }
            }
        }
    }

    // Loads the subject choices from the data file dependent on what subject is selected
    function subjectChoiceLoad() {
        return Object.entries(subNumsToNames).map(([id]) => {
            if (data[certificate].hasOwnProperty(id)) {
            return (
                <option key={id} value={id}>
                {subNumsToNames[id]}
                </option>
            );
            } else {
            return null; // Skip rendering the option if the ID doesn't exist in data["lc"]
            }
        });
    }

    // Loads the year choices dependent on what subject is selected
    function yearChoiceLoad() {
        return Object.entries(data[certificate][subject]).map(([year]) => {
            if (data[certificate][subject].hasOwnProperty(year)) {
                return (
                    <option key={year} value={year}>
                    {year}
                    </option>
                );
            } else {
                return null;
            }
        }).reverse();
    }

    return (
        <>
            <form className='flex flex-row flex-wrap gap-3 justify-center hover:cursor-pointer'>
                <select name="certificate" value={certificate} onChange={handleChange}
                    className=""
                >
                    <option value="lc">Leaving Certificate</option>
                    <option value="jc">Junior Certificate</option>
                </select>

                <select name="subject" value={subject} onChange={handleChange}>
                    {subjectChoiceLoad()}
                </select>

                <select name="year" value={year} onChange={handleChange}>
                    {yearChoiceLoad()}
                </select>

                <div className='w-40'>
                    
                    {/* TODO: Commit a cardinal sin and make these classes. */}
                    <Listbox name="level" defaultValue={level} onChange={handleLevelChange}>
                        <div className="relative">
                            <Listbox.Button className="text-white text-left bg-zinc-900 border-2 border-spacing-2 border-white w-full rounded-md p-3 hover:border-slate-400 transition-all duration-200">
                                {level}
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                            
                            <Listbox.Options className="absolute mt-2 z-50 w-full max-h-60 overflow-auto rounded-md bg-gray-950 border-2 border-white">
                                <Listbox.Option  value="Higher" disabled={tempHigherDisabled} className={
                                    `top-0 h-full relative pl-10 ui-selected:bg-gray-700 py-[0.3rem] pt-[0.5rem]
                                    ui-active:bg-zinc-800 ui-not-active:bg-black text-red transition-all duration-100
                                    ${tempHigherDisabled ? "text-red-500 !bg-red-950/70 italic line-through" : "text-white"}`
                                    }>
                                        
                                    <>
                                        <span className="block truncate font-normal ui-selected:font-medium">
                                            Higher
                                        </span>
                                        <span className="absolute hidden inset-y-0 left-0 items-center pl-3 text-zinc-200 ui-selected:flex">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    </>
                                 </Listbox.Option>

                                 <Listbox.Option value="Ordinary" disabled={tempOrdinaryDisabled} className={
                                    `top-0 h-full relative pl-10 ui-selected:bg-gray-700 py-[0.3rem]
                                    ui-active:bg-zinc-800 ui-not-active:bg-black text-red transition-all duration-100
                                    ${tempOrdinaryDisabled ? "text-red-500 !bg-red-950/70 italic line-through" : "text-white"}`
                                    }>

                                    <>
                                        <span className="block truncate font-normal ui-selected:font-medium">
                                            Ordinary
                                        </span>
                                        <span className="absolute hidden inset-y-0 left-0 items-center pl-3 text-zinc-200 ui-selected:flex">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    </>
                                 </Listbox.Option>

                                 <Listbox.Option value="Foundation" disabled={tempFoundationDisabled} className={
                                    `top-0 h-full relative pl-10 ui-selected:bg-gray-700 py-[0.3rem]
                                    ui-active:bg-zinc-800 ui-not-active:bg-black text-red transition-all duration-100
                                    ${tempFoundationDisabled ? "text-red-500 !bg-red-950/70 italic line-through" : "text-white"}`
                                    }>
                                    <>
                                        <span className="block truncate font-normal ui-selected:font-medium">
                                            Foundation
                                        </span>
                                        <span className="absolute hidden inset-y-0 left-0 items-center pl-3 text-zinc-200 ui-selected:flex">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    </>
                                 </Listbox.Option>

                                 <Listbox.Option value="Common" disabled={tempCommonDisabled} className={
                                    `top-0 h-full relative pl-10 ui-selected:bg-gray-700 py-[0.3rem] pb-[0.6rem]
                                    ui-active:bg-zinc-800 ui-not-active:bg-black text-red transition-all duration-100
                                    ${tempCommonDisabled ? "text-red-500 !bg-red-950/70 italic line-through" : "text-white"}`
                                    }>
                                    <>
                                        <span className="block truncate font-normal ui-selected:font-medium">
                                            Common
                                        </span>
                                        <span className="absolute hidden inset-y-0 left-0 items-center pl-3 text-zinc-200 ui-selected:flex">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    </>
                                 </Listbox.Option>
                            </Listbox.Options>
                        </div>
                    </Listbox>
                </div>

                <div className="inline-flex">
                    <button onClick={() => setLanguage("EV")} type="button" className={`text-white border-2 py-2 px-4 rounded-l
                    enabled:hover:bg-zinc-800
                    disabled:text-slate-300 disabled:italic
                    ${language === "EV" ? "bg-zinc-900 font-bold" : "bg-zinc-900 font-normal"}
                    `}
                    disabled={englishDisabled}>
                    English
                    </button>
                    <button onClick={() => setLanguage("IV")} type="button" className={`text-white border-2 py-2 px-4 rounded-r
                    enabled:hover:bg-zinc-800
                    disabled:text-slate-300 disabled:italic
                    ${language === "IV" ? "bg-zinc-900 font-bold" : "bg-zinc-900 font-normal"}
                    `} 
                    disabled={irishDisabled}>
                    Irish
                    </button>
                </div>
            </form>

            <PaperGrid examPaperList={examList} />
        </>
    );
    }

export default ChoicesForm;