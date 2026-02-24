// 1. Create a floating "Solve" button on the screen
const button = document.createElement("button");
button.innerText = "🤖 Solve Quiz";
button.style.position = "fixed";
button.style.bottom = "80px";
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

  const questionBlocks = document.querySelectorAll(".qt-mc-question");
  let quizData = [];

  questionBlocks.forEach((block, index) => {
    const qTextElement = block.querySelector(".qt-question");
    const questionText = qTextElement
      ? qTextElement.innerText.trim()
      : "Unknown Question";

    const optionElements = block.querySelectorAll(".gcb-mcq-choice label");
    let options = [];
    optionElements.forEach((opt) => options.push(opt.innerText.trim()));

    if (questionText !== "Unknown Question") {
      quizData.push({
        id: `q_${index}`,
        question: questionText,
        options: options,
      });
    }
  });

  // Change button state to show it is thinking
  button.innerText = "⏳ Thinking...";
  button.style.backgroundColor = "#eab308"; // Yellow

  // Send the completely built array to the background script
  chrome.runtime.sendMessage(
    { action: "solve_quiz", data: quizData },
    (response) => {
      if (response && response.success) {
        console.log("🧠 LLM Answers Received:", response.answers);

        let clickCount = 0;

        // --- THE GHOST HANDS (DOM Manipulation) ---
        // Loop through the answers provided by the LLM
        for (const [qId, answerText] of Object.entries(response.answers)) {
          // Extract the index number from the ID (e.g., "q_0" -> 0)
          const index = parseInt(qId.split("_")[1]);
          const block = questionBlocks[index];

          if (!block) continue; // Safety check

          // Look at all the choices for this specific question
          const choices = block.querySelectorAll(".gcb-mcq-choice");
          choices.forEach((choice) => {
            const label = choice.querySelector("label");

            // If the text on the screen matches the AI's answer
            if (label && label.innerText.trim() === answerText.trim()) {
              const radioInput = choice.querySelector("input[type='radio']");

              if (radioInput) {
                radioInput.click(); // Physically click the button!

                // Optional: Highlight the choice in light green to show it was AI-selected
                choice.style.backgroundColor = "#dcfce7";
                choice.style.borderRadius = "4px";

                clickCount++;
              }
            }
          });
        }

        // Reset button to show success
        button.innerText = `✅ Solved ${clickCount}!`;
        button.style.backgroundColor = "#16a34a"; // Green

        // Reset button text after 3 seconds
        setTimeout(() => {
          button.innerText = "🤖 Solve Quiz";
          button.style.backgroundColor = "#2563eb"; // Back to Blue
        }, 3000);
      } else {
        console.error(
          "❌ LLM Error:",
          response ? response.error : "Failed to connect to background script.",
        );
        alert("Something went wrong asking the LLM.");

        button.innerText = "🤖 Solve Quiz";
        button.style.backgroundColor = "#2563eb";
      }
    },
  );
});
