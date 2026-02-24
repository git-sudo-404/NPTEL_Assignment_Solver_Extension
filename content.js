// 1. Create a floating "Solve" button on the screen
const button = document.createElement("button");
button.innerText = "🤖 Solve Quiz";
button.style.position = "fixed";
button.style.bottom = "80px"; // Moved up slightly so it doesn't overlap NPTEL's scroll button
button.style.right = "20px";
button.style.zIndex = "9999";
button.style.padding = "15px 25px";
button.style.backgroundColor = "#2563eb";
button.style.color = "white";
button.style.border = "none";
button.style.borderRadius = "8px";
button.style.fontSize = "16px";
button.style.fontWeight = "bold";
button.style.cursor = "pointer";
button.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";

document.body.appendChild(button);

// 2. The NPTEL Extraction Engine
button.addEventListener("click", () => {
  console.log("🔍 Scanning NPTEL page for questions...");

  // Target NPTEL's specific question blocks
  const questionBlocks = document.querySelectorAll(".qt-mc-question");

  let quizData = [];

  questionBlocks.forEach((block, index) => {
    // Grab the question text using NPTEL's class
    const qTextElement = block.querySelector(".qt-question");
    const questionText = qTextElement
      ? qTextElement.innerText.trim()
      : "Unknown Question";

    // Grab the multiple choice options using NPTEL's classes
    // We target the label inside the choice block to get the clean text
    const optionElements = block.querySelectorAll(".gcb-mcq-choice label");
    let options = [];
    optionElements.forEach((opt) => options.push(opt.innerText.trim()));

    // Store it in a clean JSON format
    if (questionText !== "Unknown Question") {
      quizData.push({
        id: `q_${index}`,
        question: questionText,
        options: options,
      });
    }
  });

  // Print the final payload to the console
  console.log("✅ Extracted Payload:", JSON.stringify(quizData, null, 2));
  alert(
    `Successfully extracted ${quizData.length} questions! Open your browser's Console (Inspect -> Console) to see the JSON data.`,
  );
});
