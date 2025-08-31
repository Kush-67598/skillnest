// /app/api/Groq/HandleImages/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { imageBase64, question } = body; // frontend should send base64 of uploaded image
    const prompt = `You are given a question and an image containing a user's answer.  
Your task is ONLY to check if the answer in the image is correct for the given question.  

- If the answer is correct: Reply with"✅ Correct: [answer].Dont Give brief Explanation".  
- If the answer is incorrect: Reply Briefly in 50 words with "❌ Incorrect: The answer does not match the question And Give a Small Hint".  

Do not provide steps, hints, or detailed explanations.
Question: ${question}
`;
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
    });

    return new NextResponse(
      JSON.stringify({ result: completion.choices[0].message.content }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
