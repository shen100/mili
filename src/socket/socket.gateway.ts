import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class SocketGateway {
    @WebSocketServer() server;

    @SubscribeMessage('hello')
    async identity(client, data: any): Promise<any> {
        return { event: 'hello_done', data };
    }
}