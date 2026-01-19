// In-memory storage for chat (not using database for this project)

interface Conversation {
  id: number;
  title: string;
  createdAt: Date;
}

interface Message {
  id: number;
  conversationId: number;
  role: string;
  content: string;
  createdAt: Date;
}

export interface IChatStorage {
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<Message>;
}

class MemChatStorage implements IChatStorage {
  private conversations: Map<number, Conversation> = new Map();
  private messages: Map<number, Message> = new Map();
  private nextConvId = 1;
  private nextMsgId = 1;

  async getConversation(id: number) {
    return this.conversations.get(id);
  }

  async getAllConversations() {
    return Array.from(this.conversations.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createConversation(title: string) {
    const conv: Conversation = { id: this.nextConvId++, title, createdAt: new Date() };
    this.conversations.set(conv.id, conv);
    return conv;
  }

  async deleteConversation(id: number) {
    this.conversations.delete(id);
    for (const [msgId, msg] of this.messages) {
      if (msg.conversationId === id) this.messages.delete(msgId);
    }
  }

  async getMessagesByConversation(conversationId: number) {
    return Array.from(this.messages.values())
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(conversationId: number, role: string, content: string) {
    const msg: Message = { id: this.nextMsgId++, conversationId, role, content, createdAt: new Date() };
    this.messages.set(msg.id, msg);
    return msg;
  }
}

export const chatStorage: IChatStorage = new MemChatStorage();
