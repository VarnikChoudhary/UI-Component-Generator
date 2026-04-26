
import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          framework: frameWork.value
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCode(extractCode(data.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16 pb-10">
        <div className="w-full py-6 rounded-xl bg-[var(--secondary-bg)] border border-[var(--border-color)] mt-5 p-5 shadow-sm transition-all duration-300">
          <h3 className='text-[25px] font-semibold sp-text'>AI Component Generator</h3>
          <p className='text-[var(--text-secondary)] mt-2 text-[16px]'>Describe your component and let AI code it for you.</p>

          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            value={frameWork}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
                boxShadow: "none",
                "&:hover": { borderColor: "var(--text-secondary)" }
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "var(--secondary-bg)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)"
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#a855f7"
                  : state.isFocused
                    ? "var(--tertiary-bg)"
                    : "transparent",
                color: state.isSelected ? "#fff" : "var(--text-primary)",
                "&:active": { backgroundColor: "#a855f7" }
              }),
              singleValue: (base) => ({ ...base, color: "var(--text-primary)" }),
              placeholder: (base) => ({ ...base, color: "var(--text-secondary)" }),
              input: (base) => ({ ...base, color: "var(--text-primary)" })
            }}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className='w-full min-h-[200px] rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] mt-3 p-3 text-[var(--text-primary)] placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all duration-300'
            placeholder="Describe your component in detail and AI will generate it..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
            <p className='text-[var(--text-secondary)] text-sm'>Click on generate button to get your code</p>
            <button
              onClick={getResponse}
              className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 text-white px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95"
            >
              {loading ? <ClipLoader color='white' size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        <div className="relative mt-5 w-full h-[80vh] bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm transition-all duration-300">
          {
            !outputScreen ? (
              <div className="w-full h-full flex items-center flex-col justify-center">
                <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white">
                  <HiOutlineCode />
                </div>
                <p className='text-[16px] text-[var(--text-secondary)] mt-3'>Your component & code will appear here.</p>
              </div>
            ) : (
              <div className='flex flex-col h-full'>
                <div className="bg-[var(--tertiary-bg)] w-full h-[50px] flex items-center gap-3 px-3">
                  <button
                    onClick={() => setTab(1)}
                    className={`w-1/2 py-2 rounded-lg transition-all ${tab === 1 ? "bg-purple-600 text-white" : "bg-[var(--secondary-bg)] text-[var(--text-secondary)] border border-[var(--border-color)]"}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`w-1/2 py-2 rounded-lg transition-all ${tab === 2 ? "bg-purple-600 text-white" : "bg-[var(--secondary-bg)] text-[var(--text-secondary)] border border-[var(--border-color)]"}`}
                  >
                    Preview
                  </button>
                </div>

                <div className="bg-[var(--secondary-bg)] w-full h-[50px] flex items-center justify-between px-4 border-b border-[var(--border-color)]">
                  <p className='font-bold text-[var(--text-primary)]'>Code Editor</p>
                  <div className="flex items-center gap-2">
                    {tab === 1 ? (
                      <>
                        <button onClick={copyCode} className="w-10 h-10 rounded-xl border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--tertiary-bg)] text-[var(--text-primary)]"><IoCopy /></button>
                        <button onClick={downnloadFile} className="w-10 h-10 rounded-xl border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--tertiary-bg)] text-[var(--text-primary)]"><PiExportBold /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setIsNewTabOpen(true)} className="w-10 h-10 rounded-xl border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--tertiary-bg)] text-[var(--text-primary)]"><ImNewTab /></button>
                        <button onClick={() => setRefreshKey(prev => prev + 1)} className="w-10 h-10 rounded-xl border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--tertiary-bg)] text-[var(--text-primary)]"><FiRefreshCcw /></button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  {tab === 1 ? (
                    <Editor value={code} height="100%" theme={theme === 'dark' ? 'vs-dark' : 'light'} language="html" />
                  ) : (
                    <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white text-black"></iframe>
                  )}
                </div>
              </div>
            )
          }
        </div>
      </div>

      {isNewTabOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--primary-bg)] w-screen h-screen overflow-auto">
          <div className="text-[var(--text-primary)] w-full h-[60px] flex items-center justify-between px-5 bg-[var(--secondary-bg)] border-b border-[var(--border-color)]">
            <p className='font-bold'>Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--tertiary-bg)]">
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)] bg-white"></iframe>
        </div>
      )}
    </>
  )
}

export default Home
