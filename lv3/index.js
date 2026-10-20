import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { ChatGoogle } from "@langchain/google";
import { TavilySearch } from "@langchain/tavily";
import {context, createAgent, HumanMessage, tool} from "langchain"
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import z from "zod";
import { ChatGroq } from "@langchain/groq"
import { MessagesAnnotation, messagesDeltaReducer, StateGraph,MemorySaver, StateSchema, interrupt, Command } from "@langchain/langgraph";
import { MongoClient } from "mongodb";

const app = express()

const port = process.env.PORT || 5000



app.use(express.json())

const checkpointer = new MemorySaver()

// ai agent = llm + tools 

const tool1=tool(
    ({email,content})=>{

       return `email sent successfully to ${email} with content ${content}`
    },
    {
        name:"email_send_tool",
        description:"use this tool to send email",
        schema:z.object({
            email:z.string().describe("sender email"),
            content:z.string().describe("mail content for sending")
        })
    }
)




//custom tool

const tool2= tool(
    ({a,b})=>{
       return `addition of ${a} & ${b} is 7`
    },{
        name:"addition_tool",
        description:"use this tool for addition for two numbers",
        schema:z.object({
            a:z.number(),
            b:z.number()
        })
    }
)



const tools=[tool1,tool2]

const model = new ChatGoogle("gemini-2.5-flash").bindTools(tools)

const toolNode=new ToolNode(tools)

const agent=async (state)=>{

    const result=await model.invoke(
       state.messages
    )

    return {
        messages:[result]
    }
    
}


const shouldContinue=async (state)=>{
    console.log(state)
    if(state.messages[state.messages.length-1].tool_calls.length>0){
        return "tool_node"
    }else{
        return "__end__"
    }
}

// state=[
//     humanMessage:"",
//     AiMessage:"",
//     toolMessage:"",
//     AiMessages:""
// ]

const graph=new StateGraph(MessagesAnnotation)
.addNode("agent",agent)
.addNode("tool_node",toolNode)
.addEdge("__start__","agent")
.addConditionalEdges("agent",shouldContinue)
.addEdge("tool_node","agent")
.compile({checkpointer})




app.post("/chat", async (req, res) => {
    const { prompt } = req.body
    const result=await graph.invoke(
        {
        messages:[
            {
                role:"user",
                content:prompt
            }
        ]
    },

    {
        configurable:{thread_id:"user-123"}
    }

)

    console.log(result.messages)
    return res.json(result.messages[result.messages.length-1].content)
      
})

// const customState=new StateSchema({
//     prompt:z.string(),
//     approvalRequires:z.boolean(),
//     aiResponse:z.string(),
//     approved:z.boolean(),
//     result:z.string()
// })




// app.post("/chat",async (req,res)=>{
//    const {prompt}=req.body
   
// })


app.listen(port, () => {
    console.log("server started at ", port)
})