# 🤖 NPTEL AI Quiz Solver Extension

A lightweight, powerful browser extension for Google Chrome and Brave that automatically reads NPTEL multiple-choice assignments and selects the correct answers using Google's state-of-the-art **Gemini 2.5 Flash AI**.

**Note:** This extension requires you to use your own (free) Google Gemini API key.

---

## ✨ Features

- **DOM Extraction:** Accurately scrapes questions and options directly from the NPTEL assignment page.
- **AI Integration:** Uses Gemini 2.5 Flash for rapid, accurate reasoning.
- **Ghost Hands:** Automatically clicks the correct radio buttons on the screen and highlights the AI's choices in green.
- **Secure BYOK:** "Bring Your Own Key" architecture ensures your API key is stored locally and securely in your own browser.

---

## 🚀 Installation Guide

Since this extension is not currently hosted on the Chrome Web Store, you will need to install it manually using "Developer Mode". It takes less than 2 minutes.

### Step 1: Download the Extension

1. Go to the [Releases page](../../releases) of this repository (or download the `.zip` file provided by the author).
2. Download the `nptel-solver-v1.zip` file.
3. **Important:** Extract/Unzip the downloaded file into a folder on your computer. Keep this folder somewhere safe where you won't accidentally delete it.

### Step 2: Load into your Browser

1. Open Google Chrome or Brave.
2. Type the following into your URL bar and hit enter:
   - Chrome: `chrome://extensions/`
   - Brave: `brave://extensions/`
3. In the top right corner, toggle **Developer mode** to **ON**.
4. Click the **Load unpacked** button that appears in the top left.
5. Select the extracted folder from Step 1.
6. The extension is now installed! Pin it to your toolbar by clicking the puzzle piece icon 🧩 in the top right of your browser and clicking the pin icon.

---

## 🔑 Setup: Adding Your API Key

To make the AI work, you need a free API key from Google.

1. Go to [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account.
2. Click **Get API key** in the left menu.
3. Click **Create API key** and copy the generated key (it usually starts with `AIzaSy...`).
4. Go back to your browser, right-click the **NPTEL Quiz Solver** icon in your toolbar, and select **Options**.
5. Paste your copied API key into the text box and click **Save Key**.
   _(You should see a green success message)._

---

## 🎯 How to Use

1. Open any NPTEL Assignment page containing multiple-choice questions.
2. You will see a blue floating **🤖 Solve Quiz** button in the bottom right corner of the screen.
3. Click the button.
4. The button will turn yellow and say **"⏳ Thinking..."** while the AI processes the questions.
5. After a few seconds, the button will turn green, and the correct radio buttons on the screen will be automatically clicked and highlighted for you!

---

## ⚠️ Disclaimer

This tool is intended for educational assistance, accessibility, and experimental purposes. Please review your institution's academic integrity policies regarding the use of AI tools for assignments. The creator is not responsible for any misuse of this software.
