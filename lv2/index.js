import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { ChatGoogle } from "@langchain/google";
import { TavilySearch } from "@langchain/tavily";
import {createAgent} from "langchain"

const app=express();
const PORT=process.env.PORT || 5000;

app.use(express.json());

const tool = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

const model = new ChatGoogle("gemini-2.5-flash")







app.post("/chat",async (req,res)=>{
    const {prompt} = req.body;
    const agent = createAgent({
        model,
        tools:[tool]
    })
    const result = await agent.invoke({
        messages:[
            {
                role:"user",
                content:prompt
            }
        ]
    })
    console.log(result.messages[result.messages.length - 1])

    return res.json("successfull")

})


// app.post("/chat",async (req,res)=>{
//     const {prompt} = req.body;
//     const model = new ChatGoogle("gemini-2.5-flash")

//     const result = await model.invoke(prompt);
//     return res.json(result.text)

// })




app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})