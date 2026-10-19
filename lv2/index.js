import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { ChatGoogle } from "@langchain/google";
import { TavilySearch } from "@langchain/tavily";
import {createAgent, Tool} from "langchain"
import { z } from "zod";
const app=express();
const PORT=process.env.PORT || 5000;

app.use(express.json());

const tool = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

const tool1 = new Tool(
    ({email,content})=>{
       return `email sent successfully to ${email} with content ${content}`
    },
    {
        name:"email_send_tool",
        description:"this tool is used to send email",
        schema:z.object({
            email:z.string().describe("email of the recipient"),
            content:z.string().describe("mail content for sending")
        })
    }
)

// custom tool
const tool2 = new Tool(
    ({a, b})=>{
    return `addition of ${a} and ${b}`
    },
    {
        name:"addition",
        description:"this tool is used to add two numbers",
        schema:z.object({
            a:z.number(),
            b:z.number()
        })
    }
)


const model = new ChatGoogle("gemini-2.5-flash")







app.post("/chat",async (req,res)=>{
    const {prompt} = req.body;
    const agent = createAgent({
        model,
        tools:[tool, tool2]
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