"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Loader from "@/Components/Loader/loader";
import Image from "next/image";

export default function SingleLesson({
  lesson,
  courseId,
  chapterId,
  subchapterId,
}) {
  console.log(lesson);
  const [groqresponse, setGroqResponse] = useState(null); // summary
  const [quizData, setQuizData] = useState(null); // quiz
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [loadingSummary, setLoadingSummary] = useState(false); // ✅ loader state
  const [loadingQuiz, setLoadingQuiz] = useState(false); // ✅ loader state

  const router = useRouter();

  const sections = lesson.sections.map((item) => ({
    section_title: item.subHeading,
    section_paragraph: item.paragraph,
    section_codeSnippet: item.codeSnippet,
  }));

  // Fetch Summary
  const fetchSummary = async () => {
    setQuizData(null);
    setGroqResponse(null);

    setLoadingSummary(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Groq`, {
        method: "POST",
        body: JSON.stringify({ title: lesson.title, sections }),
      });
      const res = await response.json();
      if (res.success) {
        setGroqResponse(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch Quiz
  const fetchQuiz = async () => {
    setGroqResponse(null);
    setQuizData(null);

    setLoadingQuiz(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/Groq`, {
        method: "POST",
        body: JSON.stringify({ title: lesson.title, sections }),
      });
      const res = await response.json();
      if (res.success) {
        setQuizData(res.data.Quiz || []); // expecting Quiz array
        setSelectedAnswers({});
        setCurrentQuestion(0);
        setShowResults(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleAnswerSelect = (qIndex, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleNextQuestion = (quizLength) => {
    if (currentQuestion < quizLength - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const videoURL = lesson.videoURL;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 mt-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text mb-8 sm:mb-10">
        📺 Lesson: {lesson.title}
      </h1>

      <button
        className="text-white mb-6 hover:text-gray-300 transition"
        onClick={() =>
          router.push(
            `/Course/${courseId}/chapters/${chapterId}/subchapters/${subchapterId}/lessons`
          )
        }
      >
        BACK
      </button>

      <article className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 sm:p-8 space-y-6 text-white">
        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            <span className="font-medium">Order:</span> {lesson.order || "N/A"}
          </p>

          {videoURL && (
            <div className="mt-4">
              <video
                src={videoURL}
                controls
                className="rounded-xl shadow-md border border-gray-700 w-full max-h-[400px]"
              />
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {lesson.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-gray-800/60 p-5 rounded-xl border border-gray-700 shadow-inner space-y-4"
            >
              {section.mainTitle && (
                <h2 className="text-2xl font-semibold text-blue-400">
                  {section.mainTitle}
                </h2>
              )}
              {section.images.map((img, imgidx) => (
                <div key={imgidx}>
                 <Image width={900} height={20} className="bg-red-500 h-96  " alt="image" src={img}></Image>
                </div>
              ))}

              {section.subHeading && (
                <h3 className=" text-center mb-15 text-2xl font-medium text-purple-300">
                  {section.subHeading}
                </h3>
              )}

              {section.paragraph && (
                <p className="text-gray-300 leading-relaxed">
                  {section.paragraph}
                </p>
              )}

              {section.codeSnippet && (
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  wrapLongLines={true}
                  customStyle={{
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    fontSize: "0.9rem",
                    lineHeight: "1.6",
                  }}
                >
                  {section.codeSnippet}
                </SyntaxHighlighter>
              )}
            </div>
          ))}

          {/* Buttons for Summary and Quiz */}
          <div className="flex justify-between gap-4 my-6">
            <button
              className="bg-purple-300 w-full text-black px-4 py-3 cursor-pointer rounded-2xl"
              onClick={fetchSummary}
            >
              Generate Summary 😎
            </button>
            <button
              className="bg-green-300 w-full text-black px-4 py-3 cursor-pointer rounded-2xl"
              onClick={fetchQuiz}
            >
              Generate Quiz 📝
            </button>
          </div>

          {/* AI Summary */}
          {loadingSummary ? (
            <Loader message="Generating summary..." />
          ) : loadingQuiz ? (
            <Loader message="Generating quiz..." />
          ) : groqresponse ? (
            <div className="bg-gray-800/70 p-6 rounded-2xl border border-gray-700 shadow-lg space-y-6 mt-6 text-white">
              <h1 className="text-4xl font-bold text-center">Summary</h1>

              {groqresponse.summaryPara && (
                <p className="text-gray-300 leading-relaxed">
                  {groqresponse.summaryPara}
                </p>
              )}

              {groqresponse.KeyPoints && groqresponse.KeyPoints.length > 0 && (
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-purple-300">
                    Key Points:
                  </h3>
                  <ul className="list-disc list-inside text-gray-200">
                    {groqresponse.KeyPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}

          {/* Quiz Section */}
          {quizData && quizData.length > 0 && (
            <div className="bg-gray-800/70 p-6 rounded-2xl border border-gray-700 shadow-lg mt-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-green-400">
                  Quiz Time 📝
                </h3>
                <p>
                  {!showResults ? currentQuestion : currentQuestion + 1}/
                  {quizData.length}
                </p>
              </div>

              {!showResults ? (
                <div className="bg-gray-900/70 p-4 rounded-xl border border-gray-700">
                  {/* Show only current question */}
                  <p className="font-medium text-white">
                    {currentQuestion + 1}. {quizData[currentQuestion].question}
                  </p>
                  <div className="space-y-2 mt-2">
                    {quizData[currentQuestion].options.map((opt, oIndex) => {
                      const isSelected =
                        selectedAnswers[currentQuestion] === opt;
                      return (
                        <button
                          key={oIndex}
                          className={`block w-full text-left px-3 py-2 rounded-lg border ${
                            isSelected
                              ? "bg-purple-600 border-purple-400"
                              : "bg-gray-800 border-gray-600 hover:bg-gray-700"
                          }`}
                          onClick={() =>
                            handleAnswerSelect(currentQuestion, opt)
                          }
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="mt-4 cursor-pointer bg-blue-500 px-4 py-2 rounded-xl"
                    onClick={() => handleNextQuestion(quizData.length)}
                  >
                    {currentQuestion < quizData.length - 1
                      ? "Next ➡️"
                      : "Finish ✅"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-yellow-400">
                    🎉 Results
                  </h3>
                  {quizData.map((q, qIndex) => {
                    const userAnswer = selectedAnswers[qIndex];
                    const isCorrect = userAnswer === q.answer;
                    return (
                      <div
                        key={qIndex}
                        className={`p-3 rounded-lg border ${
                          isCorrect
                            ? "bg-green-800 border-green-400"
                            : "bg-red-800 border-red-400"
                        }`}
                      >
                        <p>
                          {qIndex + 1}. {q.question}
                        </p>
                        <p className="text-sm">
                          Your Answer:{" "}
                          <span className="font-semibold">
                            {userAnswer || "Not Answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm">
                            Correct Answer:{" "}
                            <span className="font-semibold">{q.answer}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
