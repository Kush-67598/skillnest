import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const { title, sections } = await req.json();
    try {
      const response = await openai.responses.create({
        model: "moonshotai/kimi-k2-instruct",
        input: `Generate the Summary of ${title} in around 100 words. 
Lesson details are: ${JSON.stringify(sections)}. 
Return:
1. A summary paragraph.
2. 5 key points.
3. A quiz: 5 questions, each with 4 options, and the correct answer.`,
        text: {
          format: {
            type: "json_schema",
            name: "LessonSummary",
            schema: {
              type: "object",
              properties: {
                Game_Name: { type: "string" },
                summaryPara: { type: "string" },
                KeyPoints: {
                  type: "array",
                  items: { type: "string" },
                },
                Quiz: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      options: {
                        type: "array",
                        items: { type: "string" },
                      },
                      answer: { type: "string" },
                    },
                    required: ["question", "options", "answer"],
                  },
                },
              },
              required: ["Game_Name", "summaryPara", "KeyPoints", "Quiz"],
              additionalProperties: false,
            },
          },
        },
      });
      const data = JSON.parse(response.output_text);
      return NextResponse.json({ data, success: true });
    } catch (err) {
      return NextResponse.json({ err: "Cant Create Response because" + err });
    }
  } catch (err) {
    return NextResponse.json({ err: "Internal Server Error" });
  }
}
