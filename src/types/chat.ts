export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: string;
  timestamp: number;
}
