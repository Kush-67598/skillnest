// /app/api/Groq/HandleImages/route.js
import OpenAI from "openai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { imageBase64, userInput } = body; // frontend should send base64 of uploaded image

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
              text:
                userInput +
                "Dont give any any symbols like * everywhere just use bullets if need ",
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

    return new Response(
      JSON.stringify({ result: completion.choices[0].message.content }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
