import mongoose, { Schema } from "mongoose";
import moment from "moment";
const messageSchema = new Schema({
    sendDate: { type: Date, required: true, default: Date.now },
    message: { type: String, required: true },
}, { toJSON: { virtuals: true } }); // This is exprerimental and will be changed later
// A Virtual is a property that is not stored in MongoDB just in Memory but can be used as a normal property and return the sendDate property as formatedDate
messageSchema.virtual('formattedDate').get(function () {
    return moment(this.sendDate).format('DD-MM-YYYY HH:mm:ss');
});
const MessageModel = mongoose.model('Message', messageSchema);
export default MessageModel;
