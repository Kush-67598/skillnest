import OpenAI from "openai";

export async function POST(req) {
  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const response = await openai.responses.create({
    model: "moonshotai/kimi-k2-instruct",
    input: `Generate a Single Question From DSA with Difficulty Levels Easy,Medium,Hard.Elaborate the Problem a little Bit `,
    text: {
      format: {
        type: "json_schema",
        name: "Problem-of-the-Day",
        schema: {
          type: "object",
          properties: {
            Question: { type: "string" },
            Answer: { type: "string" },
            Difficulty: { type: "string" },
          },
          //   required: ["Question"],
          additionalProperties: false,
          required: ["Question", "Answer", "Difficulty"],
        },
      },
    },
  });
  const data = JSON.parse(response.output_text);
  return Response.json({ data, success: true });
}
