'use client'
import { useState, useEffect } from 'react';
import PaperGrid from './PaperGrid';
import { Combobox, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { AnimatePresence, motion } from "framer-motion"

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

    const [examList, setExamList] = useState<string[][]>([]);
    const [query, setQuery] = useState('')

    const [showYearDropdown, setShowYearDropdown] = useState(false);

    let tempExamList:string[][]; // To be used because of useState's asynchronity
    let currentLevel: string = "Higher";

    let tempSubject:string = subject;
    let tempYear:string = year;

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
                        
                        if("exampapers" in documentList) { // Prevents the "exampapers" key from being accessed if it doesn't exist
                            if(!(documentList["exampapers"].some((paperName: ExamPaper) => paperName.details.includes("Foundation") && !(docName.includes("Foundation")) && level == "Foundation"))) { // Sorry if you're reading this. Fix to an obscure bug where Sound Files from both Higher/Ordinary and Foundation would be included when "Foundation" was selected.
                                addExamToList(subjectId, docName, docUrl, cat, year);
                            }
                        }
                    }
                }
            }
        }

        setExamList(tempExamList); // Sets the exam list to the newly generated list
    }

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

        try {
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
        } catch(error) {
            console.log(error)
        }
    }

    function determineLevelAvailability() {

        if ("exampapers" in data[certificate][tempSubject][tempYear]) {
            const exampapers = data[certificate][tempSubject][tempYear]["exampapers"];

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
    }

    function handleYearChange(val: string) {
        tempYear = val;
        setYear(tempYear);
        
    }

    function handleCertChange(val: string) {
        setCertificate(val);
        setSubject(Object.keys(subNumsToNames)[0]); // Reset the subject to the first available option
        setYear(Object.keys(data[val][Object.keys(subNumsToNames)[0]])[0]); // Reset the year to the first available option
    }

    function handleSubjectChange(val: string) {
        setSubject(val);

        tempSubject = val;

        console.log((!data[certificate][val].hasOwnProperty(year)))

        // Check if the selected year is valid for the new subject
        if (!data[certificate][val].hasOwnProperty(year)) {
            // If the selected year is invalid, update the year state
            const lastKey = Object.keys(data[certificate][val]).at(-1);
            console.log(lastKey)
            if (lastKey) {
                setYear(lastKey);
            }
        }
    }

    // Loads the year choices dependent on what subject is selected
    function yearChoiceLoad() {
        return Object.entries(data[certificate][subject]).map(([yeare]) => {
            if (data[certificate][subject].hasOwnProperty(yeare)) {
                return (
                    <Listbox.Option key={yeare} value={yeare} className={
                        `top-0 relative pl-10 ui-selected:bg-gray-700 py-[0.3rem] pt-[0.5rem]
                        ui-active:bg-zinc-800 ui-not-active:bg-black`
                        }>
                            <span className="block truncate font-normal ui-selected:font-medium">
                                {yeare}
                            </span>
                            <span className="absolute hidden inset-y-0 left-0 items-center pl-3 text-zinc-200 ui-selected:flex">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                     </Listbox.Option>
                );
            } else {
                return null;
            }
        }).reverse();
    }


    const uniqueSubNumsToNames: Record<string, string> = {};
    Object.entries(subNumsToNames).forEach(([id, subjectName]) => {
      if (!Object.values(uniqueSubNumsToNames).includes(subjectName as string) && data[certificate].hasOwnProperty(id)) {
        uniqueSubNumsToNames[id] = subjectName as string;
      }
    });
    
    const filteredSubjects =
      query === ''
        ? Object.values(uniqueSubNumsToNames)
        : Object.values(uniqueSubNumsToNames).filter((subjectName) =>
            (subjectName as string).toLowerCase().includes(query.toLowerCase())
    );

    return (
        <>
            <form className='flex flex-row flex-wrap gap-3 justify-center hover:cursor-pointer'>

                <div className="w-52">
                    <Listbox name="cert" value={certificate} onChange={handleCertChange}>
                        <div className="relative">
                            <Listbox.Button className="text-white text-left bg-zinc-900 border-2 border-spacing-2 border-white w-full rounded-md p-3 hover:border-slate-400 transition-all duration-200">
                                {(certificate === "lc" ? "Leaving Certificate" : "Junior Certificate")}
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>

                            <Listbox.Options className="absolute mt-2 z-50 w-full max-h-60 overflow-auto rounded-md bg-gray-950 border-2 border-white text-white">
                                <Listbox.Option value="lc" className={
                                        `top-0 h-full relative pl-10 ui-selected:bg-gray-700 py-[0.3rem]
                                        ui-active:bg-zinc-800 ui-not-active:bg-black text-red transition-all duration-100`
                                        }>

                                        <>
                                            <span className="block truncate font-normal ui-selected:font-medium">
                                                Leaving Certificate
                                            </span>
                                            <span className="absolute hidden inset-y-0 left-0 items-center pl-3 text-zinc-200 ui-selected:flex">
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        </>
                                </Listbox.Option>

                                <Listbox.Option value="jc" className={
                                    `top-0 h-full relative pl-10 ui-selected:bg-gray-700 py-[0.3rem]
                                    ui-active:bg-zinc-800 ui-not-active:bg-black text-red transition-all duration-100`
                                    }>

                                    <>
                                        <span className="block truncate font-normal ui-selected:font-medium">
                                            Junior Certificate
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
                
                <div className="w-80">
                    <Combobox name="subject" value={subject} onChange={handleSubjectChange}>
                        <div className="relative h-full">
                            <div className="relative h-full w-full cursor-pointer overflow-hidden rounded-lg text-left border-2 border-white">
                                <Combobox.Input
                                    className="w-full h-full border-none pl-3 pr-10 leading-5 bg-zinc-900 text-white focus:ring-0"
                                    displayValue={() => subNumsToNames[subject]}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Combobox.Button>
                            </div>

                            <Combobox.Options className="absolute mt-2 z-50 py-2 w-full max-h-60 overflow-auto rounded-md bg-gray-950 border-2 border-white text-white">
                            {filteredSubjects.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-white">
                                No subjects found.
                                </div>
                            ) : (
                                filteredSubjects.map((subjectName) => {
                                    const subjectId = Object.keys(subNumsToNames).find(
                                        (id) => subNumsToNames[id] === subjectName
                                    );

                                    if (subjectId) {
                                        return (
                                            <Combobox.Option
                                                key={subjectId}
                                                value={subjectId}
                                                className="top-0 h-full relative pl-10 ui-selected:bg-gray-700 py-2 ui-active:bg-zinc-800 ui-not-active:bg-black text-red transition-all duration-100"
                                            >
                                                {subjectName}
                                            </Combobox.Option>
                                        );
                                    }
                                  })
                            )}
                            </Combobox.Options>
                        </div>
                    </Combobox>
                </div>
                

                <div className="w-32">
                    <Listbox name="year" value={year} onChange={handleYearChange}>
                        {({ open }) => (
                        <div className="relative">
                            <Listbox.Button className="text-white text-left bg-zinc-900 border-2 border-spacing-2 border-white w-full rounded-md p-3 hover:border-slate-400 transition-all duration-200">
                                {year}
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                            
                            <AnimatePresence>
                                { open && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute w-full z-50"
                                    >
                                        <Listbox.Options static className="max-h-64 mt-2 border-2 h-full border-white overflow-auto z-50 w-full rounded-md bg-gray-950 text-white">
                                            {yearChoiceLoad()}
                                        </Listbox.Options>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        )}
                    </Listbox>
                </div>

                <div className='w-40'>
                    
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