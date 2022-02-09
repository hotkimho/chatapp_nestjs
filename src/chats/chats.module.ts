import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatting, ChattingSchema } from './models/chattings.models';
import { Socket, SocketSchema } from './models/sockets.model';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Chatting.name, schema: ChattingSchema },
    { name: Socket.name, schema: SocketSchema },
  ])],
  providers: [ChatsGateway],
})
export class ChatsModule {
}
