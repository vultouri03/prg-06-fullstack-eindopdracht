import express from "express";
import Manga from "./manga.js";

const router = express.Router();

router.get('/', async (req, res) => {
    if (req.headers['accept'] === "application/json"){
        const {start, limit} = req.query
        parseInt(start);
        parseInt(limit);
        const items = (await Manga.find({}).select('name genre releaseDate').limit(limit*1).skip(start-1));
        const total = await Manga.countDocuments();


        const createPagination = (total, start, limit) => {
            return {
                "currentPage": currentPage(total, start, limit),
                "currentItems": currentItems(total, start, limit),
                "totalPages": numberOfPages(total, start, limit),
                "totalItems": total,
                "_links": {
                    "first": {
                        "page": 1,
                        "href": `http://145.24.222.173:8000/manga${getFirstQueryString(total, start, limit)}`
                    },
                    "last": {
                        "page": numberOfPages(total, start, limit),
                        "href": `http://145.24.222.173:8000/manga${getLastQueryString(total, start, limit)}`
                    },
                    "previous": {
                        "page": itemToPageNumber(total, start, limit, previousPageItem(total, start, limit)),
                        "href": `http://145.24.222.173:8000/manga${getPreviousQueryString(total, start, limit)}`
                    },
                    "next": {
                        "page": itemToPageNumber(total, start, limit, nextPageItem(total, start, limit)),
                        "href": `http://145.24.222.173:8000/manga${getNextQueryString(total, start, limit)}`
                    }
                }
            }
        }
        const pagination = createPagination(total, start, limit);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type');
        res.status(200).json(
            {

                items,

                "_links": {
                    "self": {
                        "href": "http://145.24.222.173:8000/manga"
                    }
                },
                pagination

            }
        );
    } else {
        return res.status(415).json("wrong content type")
    }
});

router.get('/:id', async (req, res) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type');
    const {id} = req.params;
    if (await Manga.findById(id) !== null) {
        if (req.headers['accept'] === "application/json"){
            const {id} = req.params;
            const manga = (await Manga.findById(id));

            return res.status(200).json(
                manga
            )
        } else {
            return res.status(415).json()
        } } else {
        return res.status(404).json()
    }

});




router.post('/', async (req, res) => {

    const { name, description, image, publisher, genre, chapters, releaseDate} = req.body;


    if(!name || !description || !image || !publisher || !genre || !chapters || !releaseDate) {

        return res.status(400).json("all fields must be entered");
    } else

    if(req.headers["content-type"] === "application/json") {

        const newManga = await Manga.create({
            name,
            description,
            image,
            publisher,
            genre,
            chapters,
            releaseDate
        })


        return res.status(201).json(newManga);
    }else if(req.headers["content-type"] === "application/x-www-form-urlencoded") {
        const newManga = await Manga.create({
            name,
            description,
            image,
            publisher,
            genre,
            chapters,
            releaseDate
        })
        return res.status(201).send(newManga);
    } else {
        return res.status(415).json("wrong content type")
    }
})

router.put('/:id', async (req, res) => {
    console.log("PUT BODY");
    console.log(req.body);
    const { id } = req.params;

    const { name, description, image, publisher, genre, chapters, releaseDate} = req.body;


    if(!name || !description || !image || !publisher || !genre || !chapters || !releaseDate) {

        return res.status(400).json("all fields must be entered");
    }

    if (await Manga.findById(id) !== null) {
        if(req.headers["content-type"] === "application/json") {
            const {id} = req.params;
            await Manga.findByIdAndUpdate(id, req.body);
            const updatedManga = await Manga.findById(id, {
                name,
                description,
                image,
                publisher,
                genre,
                chapters,
                releaseDate
            });
            return res.status(200).json(updatedManga);
        } else {
            return res.status(415).json("wrong content type")
        } } else {
        return res.status(404).json('rescource not found')
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (await Manga.findById(id) !== null) {
        if(req.headers["content-type"] === "application/json " || "application/x-www-form-urlencoded") {
            await Manga.findByIdAndDelete(id);
            return res.status(204).json(`Manga with id ${id} has been deleted`)
        } else {
            return res.status(415).json("wrong content type")
        }
    } else {
        return res.status(404);
    }


});

router.options("/", function(req, res){
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Allow', 'GET, POST, OPTIONS');
    res.send(200);
});

router.options("/:id", function(req, res){
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.send(200);
});

function currentItems(total, start, limit) {
    if(isNaN(start && limit)) {
        return total;
    } else {
        if((total-start+1)-limit > 0) {
            return limit;
        } else {
            return total - start + 1;
        }

    }
}

function numberOfPages(total, start, limit) {
    if(isNaN(start && limit)) {
        return 1;
    } else {
        return Math.ceil(total / limit);
    }
}

function currentPage(total, start, limit) {
    if(isNaN(start && limit)) {
        return 1;
    } else {
        return Math.ceil(start / limit);
    }
}

function firstPageItem(total, start, limit){
    return 1;
}

function lastPageItem(total, start, limit) {
    if(isNaN(start && limit)) {
        return 1;
    } else {
        return total - (total % limit) - limit + 1;
    }

}

function previousPageItem(total, start, limit) {
    if(isNaN(start && limit)) {
        return 1;
    } else {
        return (currentPage(total, start, limit) - 1) * limit - limit + 1;
    }

}

function nextPageItem(total, start, limit) {
    if(isNaN(start && limit)) {
        return 1;
    } else {
        return (currentPage(total, start, limit) + 1) * limit - limit + 1;
    }

}

function getFirstQueryString(total, start, limit) {
    if(isNaN(start && limit)) {
        return "";
    } else {
        return `?start=${firstPageItem(total, start, limit)}&limit=${limit}`;
    }
}

function getLastQueryString(total, start, limit) {
    if(isNaN(start && limit)) {
        return "";
    } else {
        return `?start=${lastPageItem(total, start, limit)}&limit=${limit}`;
    }
}

function getPreviousQueryString(total, start, limit) {
    if(isNaN(start && limit)) {
        return "";
    } else {
        return `?start=${previousPageItem(total, start, limit)}&limit=${limit}`;
    }
}

function getNextQueryString(total, start, limit) {
    if(isNaN(start && limit)) {
        return "";
    } else {
        return `?start=${nextPageItem(total, start, limit)}&limit=${limit}`;
    }
}

function itemToPageNumber(total, start, limit, itemNumber) {
    console.log(itemNumber)
    if(isNaN(start && limit)) {
        return 1;
    } else if(itemNumber < 0) {
        return 1;
    } else {
        return Math.ceil(itemNumber/limit);
    }
}


export default router;