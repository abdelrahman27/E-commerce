import { Schema ,Types ,model} from 'mongoose'

const brandSchema = new Schema({

    name:{type:String, required:true },
    slug:{type:String, required: true},
    logo:{type:Object },
    addedBy:{type:Types.ObjectId , ref:"User", required: false}
},{
    timestamps: true
})

const brandModel = model('Brand',brandSchema)

export default brandModel