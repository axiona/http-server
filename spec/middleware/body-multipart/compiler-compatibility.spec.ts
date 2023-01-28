import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import BodyMultipart from '../../../dist/middleware/body-multipart';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called : boolean = false;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());

    it('add request', ()=>{

        router.next(BodyMultipart()).next(function (ctx) {

            // @ts-expect-error
            const boolean : boolean = ctx.request.body;
            // @ts-expect-error
            const string : string = ctx.request.body;
            // @ts-expect-error
            const number : number = ctx.request.body;

            const object : object = ctx.request.body;
            const record : Record<PropertyKey, any> = ctx.request.body;
            ctx.response.body = record;
            called = true;
            return ctx;
        });

    });

});
