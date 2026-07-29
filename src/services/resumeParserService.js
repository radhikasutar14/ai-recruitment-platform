const pdfParse = require("pdf-parse");

const SKILLS = [
    "React",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "Redux",
    "Docker",
    "AWS",
    "Git"
];

const extractEmail = (text) => {
    const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
    return text.match(emailRegex)?.[0] || "";
};

const extractPhone = (text) => {
    const phoneRegex = /\b\d{10}\b/g;
    return text.match(phoneRegex)?.[0] || "";
};


const extractSkills = (text) => {
    return SKILLS.filter(skill =>
        text.toLowerCase().includes(skill.toLowerCase())
    );
};

const parseResume = async (buffer) => {
    const data = await pdfParse(buffer);
    const text = data.text;

    return{
        rawText: text,
        email: extractEmail(text),
        phone: extractPhone(text),
        skills: extractSkills(text)
    }
};

module.exports = parseResume;