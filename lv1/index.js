import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
const app=express();
const PORT=process.env.PORT || 5000;


const ai = new GoogleGenAI({
    apikey:process.env.GEMINI_API_KEY
})

const main = async () => {
    const response = await ai.models.generateContent({
       model:"gemini-2.5-flash",
       contents:"who is putin"
    })
    console.log(response.text)

}
main();


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})