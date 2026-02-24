// background.js

// ⚠️ MAKE SURE YOUR REAL API KEY IS HERE

// 1. Import the variables from config.js
importScripts("config.js");

// 2. Assign the key from the imported CONFIG object
const API_KEY = CONFIG.API_KEY;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "solve_quiz") {
    console.log("Background received quiz data, sending to LLM...");

    getAnswersFromLLM(request.data)
      .then((answers) => sendResponse({ success: true, answers: answers }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    return true;
  }
});

async function getAnswersFromLLM(quizData) {
  const prompt = `
    You are an expert academic assistant. I will provide you with a JSON array of multiple-choice questions.
    You must evaluate them and provide the correct answers.
    
    Return strictly a JSON object where the keys are the question IDs (e.g., "q_0", "q_1") and the values are the EXACT text of the correct option.
    Do not wrap the response in markdown code blocks like \`\`\`json. Return ONLY the raw JSON object.
    
    Questions:
    ${JSON.stringify(quizData)}
  `;

  try {
    const response = await fetch(
      // `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      // ✅ New Line
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = await response.json();

    // 🛑 DEBUGGING: Print the exact response from Google to the Background Console
    console.log("Raw API Response:", data);

    // Check if Google sent an error object (like invalid API key)
    if (data.error) {
      throw new Error(`Google API Error: ${data.error.message}`);
    }

    // Check if candidates are missing (usually safety filters)
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error(
        "API returned no data. Check the Background Console for details.",
      );
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJson = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJson);
  } catch (err) {
    throw new Error(err.message);
  }
}
