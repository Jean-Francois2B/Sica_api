const moogoose = require("mongoose");

const PostSchema = new moogoose.Schema({
    userId : {
        type : String,
        require : true
    },
    desc : {
        type : String,
        max : 500
    },
    img : {
        type : String,
    },
    audio : {
        type : String,
    },
    likes : {
        type: Array,
        default : []
    }
},
{timestamps : true}
);

module.exports = moogoose.model("Post", PostSchema);