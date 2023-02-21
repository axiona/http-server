import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import BodyMultipart from '../../../dist/middleware/body-multipart.js';
import {ValidatorParameters} from "../../../dist/middleware/validator.js";
import RecordValidator from "../validator/record-validator.js";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called  = false;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    it('add request', ()=>{

        router.next(BodyMultipart())
            .next(function (ctx) {

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
        })
            .next(ValidatorParameters(RecordValidator(), ['request', 'body']))
            .next(function (ctx) {
            const name : string = ctx.request.body.name;
            const address : string = ctx.request.body.address;
        });

    });

});
