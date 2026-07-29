const { GoogleGenerativeAI } = require("@google/generative-ai");
const { text } = require("express");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseResumeWithAI = async (resumeText) => {
    try{
        const model = genAI.getGenerativeModel({
            model : "gemini-1.5-flash"
        });
        const prompt = `
        Extract the following from this resume.
        Return ONLY valid JSON.

        Fields:
        - name
        - email
        - phone
        - skills (array)
        - education
        - experience
        - summary

        Resume:
        ${resumeText}
    `;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleaned);
    
    }catch(error){
        throw new Error(`AI parsing failed: ${error.message}`)
    }
};

module.exports = parseResumeWithAI;