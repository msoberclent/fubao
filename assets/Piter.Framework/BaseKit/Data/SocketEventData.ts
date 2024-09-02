export interface IMessage {
    messageID: string | number;
}

export class EventData implements IMessage {

    public messageID: string | number;

    public messageData: any;

    constructor(messageID: string | number, messageData?: any) {
        this.messageID = messageID;
        this.messageData = messageData;
    }
}