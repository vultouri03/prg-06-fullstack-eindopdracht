import mongoose from "mongoose";


const schema = mongoose.Schema;
const mangaSchema = new schema({
    name: String,

    description: String,

    image: String,

    publisher: String,

    genre: String,

    chapters: String,

    releaseDate: String,

 }, {
     toJSON: { getters: true},
    id: false
 });

mangaSchema.virtual('_links').get(function (){
    return {
        "self":  {
           "href": `http://145.24.222.173:8000/manga/${this._id}`
        } ,
        "collection": {
            "href": `http://145.24.222.173:8000/manga`
    }
    }
})

export default mongoose.model('Manga',  mangaSchema);


