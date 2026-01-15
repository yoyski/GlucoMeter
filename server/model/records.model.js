import mongoose from 'mongoose';

const recordsScheme = new mongoose.Schema(
  {
    date:{
      type: String,
      required: true,
    },
    result:{
      type: String,
      required: true,
    }
  }
)

const Records = mongoose.model('Records', recordsScheme);

export default Records;