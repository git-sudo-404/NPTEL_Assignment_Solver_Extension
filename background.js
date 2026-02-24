// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "solve_quiz") {
    console.log("Background received quiz data, sending to LLM...");

    // Call the async function and send the response back to content.js
    getAnswersFromLLM(request.data)
      .then((answers) => sendResponse({ success: true, answers: answers }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    // IMPORTANT: Return true tells Chrome we will send the response asynchronously
    return true;
  }
});

async function getAnswersFromLLM(quizData) {
  // 1. Grab the user's API key from their browser storage
  const storageData = await chrome.storage.local.get(["geminiApiKey"]);
  const API_KEY = storageData.geminiApiKey;

  // 2. Safety check: If they haven't added a key yet, throw a helpful error
  if (!API_KEY) {
    throw new Error(
      "No API Key found. Please right-click the extension icon and go to Options to add your key.",
    );
  }

  // 3. We strictly prompt the LLM to reply ONLY in JSON so our code can parse it.
  const prompt = `
    You are an expert academic assistant. I will provide you with a JSON array of multiple-choice questions.
    You must evaluate them and provide the correct answers.
    
    Return strictly a JSON object where the keys are the question IDs (e.g., "q_0", "q_1") and the values are the EXACT text of the correct option.
    Do not wrap the response in markdown code blocks like \`\`\`json. Return ONLY the raw JSON object.
    
    Questions:
    ${JSON.stringify(quizData)}
  `;

  try {
    // 4. The API Call to Gemini 2.5 Flash
    const response = await fetch(
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

    // 5. Check if Google sent an error object (like invalid API key)
    if (data.error) {
      throw new Error(`Google API Error: ${data.error.message}`);
    }

    // 6. Check if candidates are missing (usually safety filters)
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error(
        "API returned no data. Check the Background Console for details.",
      );
    }

    // 7. Extract and clean the JSON response
    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJson = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJson);
  } catch (err) {
    // Catch JSON parsing errors or fetch errors
    throw new Error(err.message);
  }
}
