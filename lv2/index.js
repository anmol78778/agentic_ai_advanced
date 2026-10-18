import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { ChatGoogle } from "@langchain/google";


const app=express();
const PORT=process.env.PORT || 5000;

app.use(express.json());


app.post("/chat",async (req,res)=>{
    const {prompt} = req.body;
    const model = new ChatGoogle("gemini-2.5-flash")

    const result = await model.invoke(prompt);
    return res.json(result.text)

})




app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})