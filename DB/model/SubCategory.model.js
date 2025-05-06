

import {model , Schema ,Types} from 'mongoose'


const subCategorySchema = new Schema({
name :{ type: String , required: true , unique: true},
slug :{ type: String , required: true , unique: true},
image: Object ,
createdBy: {type:Types.ObjectId , ref: 'User' , required: false},
categoryId:{type:Types.ObjectId , ref: 'category' , required: true}
},{
    timestamps: true
})

const subcategoryModel =model('Subcategory' , subCategorySchema)

export default subcategoryModel;