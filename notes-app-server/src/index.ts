import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors"

const app = express();
const prisma = new PrismaClient();

app.use(express.json())
app.use(cors())

app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json({ notes })
})

app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);

    if (!title || !content) {
        return res.status(400).send("Title and content fields are required.");
    }

    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid number");
    }

    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content }
        });
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Oops, something went wrong." });
    }
});

app.listen(5000, () => {
    console.log("server running on localhost:5000")
});

app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid number");
    }

    try{
        await prisma.note.delete({
            where: {id}
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Oops, something went wrong." });
    }
})

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
