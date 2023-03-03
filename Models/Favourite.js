var mongoose=require('mongoose');
var Schema= mongoose.Schema;

var Favourite= new Schema(
    {
    applist:{
        type: mongoose.Schema.Types.ObjectId,
      ref: 'Applist',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    },
{
  timestamps: true,
})

module.exports = mongoose.model('Favourite', Favourite);