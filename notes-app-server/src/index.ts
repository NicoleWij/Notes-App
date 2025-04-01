import { PrismaClient } from "@prisma/client";
import express from "express"
import cors from "cors"

const app = express();
const prisma = new PrismaClient();

app.use(express.json())
app.use(cors())

app.get("/api/notes", async (req, res) => {

    const notes = await prisma.note.findMany();

    res.json({notes})
})

app.listen(5000, () => {
    console.log("server running on localhost:5000")
});

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    try {
        const newNote = await prisma.note.create({
            data: { title, content }
        });
        res.status(201).json(newNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create note" });
    }
});
