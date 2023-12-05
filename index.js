import express from "express";
import {config} from "dotenv";
import mongoose from "mongoose";
import Game from "./games.js";


mongoose.connect("mongodb://127.0.0.1:27017/games", )

const app = express();

app.use(express.json());


app.listen(8000);

app.use((req, res, next) => {
    res.set('Allow', 'POST');
    next();
})



app.get('/', async (req, res) => {
    if (req.headers['accept'] === "application/json"){
        let Games = (await Game.find({}).select('name console releaseDate'));
        console.log(Games._links);

        res.json(
            {
                "items": [
                    {
                        Games,

                    }

                ],
                "_links": {
                    "self": {
                        "href": "/"
                    }
                },
                "pagination": {}
            }
        );
    } else {
        return res.status(415).json("wrong content type")
    }
});

app.get('/:id', async (req, res) => {
    if (req.headers['accept'] === "application/json"){
        const {id} = req.params;
        let game = (await Game.findById(id).select('-__v'));
        return res.status(200).json(
            {
                game
            }
        )
    } else {
        res.status(415).json()
    }
});




app.post('/', async (req, res) => {
    if(req.headers["content-type"] === "application/json " || "application/x-www-form-urlencoded") {
        const newGame = new Game(req.body)
        const insertGame = await newGame.save();
        return res.status(201).json(insertGame);
    } else {
        return res.status(415).json("wrong content type")
    }

})

app.put('/:id', async (req, res) => {

    if(req.headers["content-type"] === "application/json") {
        const { id } = req.params;
        await Game.findByIdAndUpdate(id, req.body);
        const updatedGame = await Game.findById(id).select('-__v');
        return res.status(200).json(updatedGame);
    } else {
        return res.status(415).json("wrong content type")
    }
});

app.delete('/:id', async (req, res) => {

    if(req.headers["content-type"] === "application/json " || "application/x-www-form-urlencoded") {
        const { id } = req.params;
        await Game.findByIdAndDelete(id);
        return res.status(200).json(`game with id ${id} has been deleted`)
    } else {
        return res.status(415).json("wrong content type")
    }
});

app.options("/", function(req, res, next){
    res.header('Allow', 'GET, POST, OPTIONS');
    res.send(200);
});

app.options("/:id", function(req, res, next){
    res.header('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.send(200);
});

