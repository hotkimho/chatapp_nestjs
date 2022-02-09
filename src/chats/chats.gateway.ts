import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'chat',
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');
  private users;

  constructor() {
    this.logger.log('생성자');
    this.users = {};
  }

  afterInit(server: any) {
    this.logger.log('afterInit');
  }

  handleConnection(@ConnectedSocket() socket) {
    this.logger.log(`Connected : ${socket.id}`);
  }

  handleDisconnect(@ConnectedSocket() socket) {
    this.logger.log(`Connected : ${socket.id}`);
  }

  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    //db 저장
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('boardcast_submit_chat', {
      chat,
      username: socket.id,
    });
  }
}
