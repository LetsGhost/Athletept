import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    sendDate: Date;
    message: string;
    sender: string;
}

const messageSchema = new Schema<Message>({
    sendDate: { type: Date, required: true, default: Date.now },
    message: { type: String, required: true },
    sender: { type: String, required: true }
});

export const MessageModel = mongoose.model<Message>('Message', messageSchema);
