import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import BodyJson from '../../../dist/middleware/body-json';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called : boolean = false;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());

    it('add request', ()=>{

        router.add(BodyJson.Parameter()).add(function (ctx) {

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
