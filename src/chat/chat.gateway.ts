import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './services/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private messagesService: MessagesService) {}


  @SubscribeMessage('joinConversation')
  async handleJoin(
    @MessageBody('conversationId') conversationId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(conversationId.toString());
    this.server.to(conversationId.toString()).emit('userJoined', {
      userId: client.id,
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: { conversationId: number; senderId: number; text: string },
  ) {
    const message = await this.messagesService.create(
      data.conversationId,
      data.senderId,
      data.text,
    );

    this.server.to(data.conversationId.toString()).emit('newMessage', message);
    return message;
  }
}
