const express = require('express') //set up server
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')

const PORT = 5000
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
dotenv.config()
app.use(cors())

const { GoogleGenAI } = require('@google/genai')
const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY,
})
app.get("/", (req, res) => {
    res.render("test1", { text: "heyo", answer: "" })
})

app.post("/work", async (req, res) => {

    console.log("reached work:post")
    try {
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            history: [
                {
                    role: "user",
                    parts: [{ text: "Hello" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Hi. What would you like to know?" }],
                },
            ],
        });

        const msg = req.body.message
        if (msg === "") {
            res.render("test1", { text: "heyo umm", answer: "Please enter something!" });
        }

        else {
            const response = await chat.sendMessage({
                message: msg,
                config: {
                    thinkingConfig: {
                        thinkingBudget: 0, //to disable slow ass thinking
                    },
                }
            })
            const text = response.text
            res.render("test1", { text: "heyo umm", answer: text })
        }
    }
    catch(error){
        console.log("AI has an error!")
        res.render("test1", {text: "heyo umm", answer: "I can't be reached at the moment, sorry! :("});
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})


