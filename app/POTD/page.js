"use client";

import { useEffect, useState } from "react";

export default function Test() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [problemData, setProblemData] = useState([]);

  useEffect(() => {
    if (correct === null) return; // 🚫 skip if not determined yet
    const scorefunc = async () => {
      const fetchStreak = await fetch("/api/ScoreData", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
        },
        body: JSON.stringify({ correct, difficulty: problemData.Difficulty }),
      });
      const res = await fetchStreak.json();
      console.log(correct, "correctis");
      console.log(res);
    };
    scorefunc();
  }, [result, correct]);
  useEffect(() => {
    userFetch();
  }, []);

  const userFetch = async () => {
    const res = await fetch("/api/User", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("USER_TOKEN")}`,
      },
    });

    const response = await res.json();
    setProblemData(response.POTD);
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];

      const res = await fetch("/api/Groq/HandleImages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          question: problemData[0].Question,
        }),
      });
      const data = await res.json();
      setResult(data.result);
    };
  };
  useEffect(() => {
    if (!result) return; // exit early if result is null/empty
    if (result && result.includes("Correct")) {
      setCorrect(true);
    } else if (result.includes("Incorrect")) {
      setCorrect(false);
    }
  }, [result]);

  return (
    <>
      <div className="min-h-screen bg-gray-900 px-6  -mt-20 py-10 flex items-center justify-center">
        <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left - Questions */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-purple-400 mb-5">
              Practice Questions
            </h2>
            <ul className="space-y-4">
              {problemData.length > 0 ? (
                problemData.map((item, idx) => {
                  let difficultyColor =
                    item.Difficulty === "Easy"
                      ? "bg-green-600 text-white"
                      : item.Difficulty === "Medium"
                      ? "bg-yellow-500 text-black"
                      : "bg-red-600 text-white";

                  return (
                    <li
                      key={idx}
                      className="p-5 rounded-xl bg-gray-700 max-h-full hover:bg-gray-600 transition cursor-pointer shadow-md"
                    >
                      <div className="flex flex-col items-start justify-between">
                        {/* Question Text */}

                        <span
                          className={` px-3 py-2 my-3 rounded-full text-xs font-bold ${difficultyColor}`}
                        >
                          {item.Difficulty}
                        </span>
                        <p className="text-md text-gray-200 font-semibold leading-snug max-w-[80%]">
                          {item.Question}
                        </p>
                      </div>
                      {result && result.length > 0 ? (
                        correct ? (
                          <div className="flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow-md">
                            ✅ Answer is Correct
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-md">
                            ❌ Answer is Incorrect
                          </div>
                        )
                      ) : null}
                    </li>
                  );
                })
              ) : (
                <li className="p-3 rounded-xl bg-gray-700 text-gray-400 italic text-center">
                  No questions found
                </li>
              )}
            </ul>
          </div>

          {/* Right - Upload + Prompt + Result */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-5 flex flex-col">
            {/* File Input */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Upload an Image
              </label>
              <input
                type="file"
                className="w-full text-sm text-gray-300 
                file:mr-4 file:py-2 file:px-4 
                file:rounded-xl file:border-0 
                file:text-sm file:font-semibold 
                file:bg-purple-600 file:text-white 
                hover:file:bg-purple-500"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            {/* Prompt Input */}
            {/* <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              Enter Prompt
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Type your description..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div> */}

            {/* Button */}
            <button
              onClick={handleUpload}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-semibold shadow-md transition"
            >
              Check Answer
            </button>

            {/* Result */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-purple-400 mb-3">
                Result
              </h2>
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 max-h-[50vh] overflow-y-auto">
                {result ? (
                  <p className="text-gray-200 text-base whitespace-pre-line leading-relaxed">
                    {result}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    Result will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
