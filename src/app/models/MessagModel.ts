import { timeStamp } from "console";
import mongoose, {Schema, Document} from "mongoose";
import moment from "moment";

export interface Message extends Document {
    sendDate: Date;
    message: string;
    formattedDate?: string;
}

const messageSchema = new Schema<Message>({
    sendDate: { type: Date, required: true, default: Date.now },
    message: { type: String, required: true },
}, { toJSON: { virtuals: true } }); // Stores the virtuals in the db

// A Virtual is a property that is not stored in MongoDB just in Memory but can be used as a normal property and return the sendDate property as formatedDate
messageSchema.virtual('formattedDate').get(function(this: Message) {
    return moment(this.sendDate).format('DD-MM-YYYY HH:mm:ss');
});

export const MessageModel = mongoose.model<Message>('Message', messageSchema);
