import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import BodyForm from '../../../dist/middleware/body-urlencoded.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called  = false;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    it('add request', ()=>{

        router.next(BodyForm()).next(function (ctx) {

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
