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
import { Socket as SocketModel } from './models/sockets.model';
import { InjectModel } from '@nestjs/mongoose';
import { Chatting } from './models/chattings.models';
import { Model } from 'mongoose';


@WebSocketGateway({
  namespace: 'chat',
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('chat');
  private users;

  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name) private readonly socketModel: Model<SocketModel>) {
    this.logger.log('생성자');
  }

  afterInit(server: any) {
    this.logger.log('afterInit');
  }

  async handleConnection(@ConnectedSocket() socket) {

    this.logger.log(`Connected : ${socket.id}`);
  }

  async handleDisconnect(@ConnectedSocket() socket) {
    const user = await this.socketModel.findOne({ id: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.delete();
    }
    this.logger.log(`Connected : ${socket.id}`);
  }

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const exist = await this.socketModel.exists({ username });
    if (exist)
      username = `${username}_${Math.floor(Math.random() * 100)}`;

    await this.socketModel.create({
      id: socket.id,
      username,
    });

    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.socketModel.findOne({ id: socket.id });

    await this.chattingModel.create({
      user: socketObj,
      chat: chat,
    });
    socket.broadcast.emit('boardcast_submit_chat', {
      chat,
      username: socketObj.username,
    });
  }
}
