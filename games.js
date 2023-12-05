import mongoose from "mongoose";


const schema = mongoose.Schema;
const gameSchema = new schema({

    name: String,

    description: String,

    image: String,

    publisher: String,

    console: String,

    releaseDate: String,

    date: { type: Date, default: Date.now },


 }, {
     toJSON: { getters: true},
    id: false
 });

gameSchema.virtual('_links').get(function (){
    return {
        "self":  {
           "href": `/${this._id}`
        } ,
        "collection": {
            "href": `/`
    }
    }
})

export default mongoose.model('Game', gameSchema);


