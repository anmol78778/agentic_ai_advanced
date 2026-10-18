import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
const app=express();
const PORT=process.env.PORT || 5000;

import { ChatGoogle } from "@langchain/google";
import { ChatGroq } from "@langchain/groq"
// const ai = new GoogleGenAI({
//     apikey:process.env.GEMINI_API_KEY
// })

app.use(express.json());

//streaming
// const main = async () => {
//     const responseStream = await ai.models.generateContentStream({
//     model: "gemini-3.8-flash",
//     contents: "Explain about ai",
//   });

//   for await (const chunk of responseStream) {
//     console.log(chunk.text);
//   }

// }
// main();


// project

// app.post("/chat",async (req,res)=>{
//     const {prompt}=req.body
//     const result=await ai.models.generateContent({
//         model:"gemini-3.5-flash",
//         contents:prompt
//     })

//     return res.json(result.text)

// })


// langchain



app.post("/chat",async (req,res)=>{
    const {prompt}=req.body
    const ai = new ChatGroq({
        model:"openai/gpt-oss-120b",
        temperature:0.7,
        // maxOutputTokens:90
    })

    // const result=await ai.invoke(prompt)
    const result=await ai.invoke([
        {
            role:"system",
            content:"You are a helpful assistant"
        },

        {
            role:"user",
            content:prompt
        }
    ])

    return res.json(result.content)

})



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})