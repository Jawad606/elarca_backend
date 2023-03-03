var mongoose=require('mongoose');
var Schema= mongoose.Schema;

var Rating= new Schema(
    {
    app:{
        type: mongoose.Schema.Types.ObjectId,
      ref: 'Applist',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    star:{
        type:Number,
        default:'0'
    },
    review:{
        type:String,
        default:""
    }
    },
{
  timestamps: true,
})

module.exports = mongoose.model('Rating', Rating);