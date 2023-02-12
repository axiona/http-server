import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Router from '../../../dist/router/middleware.js';
import Axios, {AxiosResponse} from 'axios';
import Context from '../../../dist/context/context.js';

describe('multi', () => {

    type Data = string[];

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    const router =  BindToServer(server, Router((context) : Context<{}, {body:string[]}> => {

        context.response.body = [];
        return context as Context<{}, {body:string[]}>;
    }));


    router.extends(r=>r.catch(function (ctx, error) {
            ctx.response.body.push('group 1, catch 1');
        })
            .next(function (ctx) {

                ctx.response.body.push('group 1, throw 1');
                throw new Error('group 1, error 1');
                return ctx;
            })
            .next(function (ctx) {

                ctx.response.body.push('group 1, call 2');
                return ctx;
            })
    );

    router.extends(r=>r.catch(function (ctx, error) {
            ctx.response.body.push('group 1, catch 1');
        })
            .next(function (ctx) {

                ctx.response.body.push('group 2, throw 1');
                throw new Error('group 1, error 1');
                return ctx;
            })
            .next(function (ctx) {

                ctx.response.body.push('group 2, call 1');
                return ctx;
            })

    );

    router.next(function (ctx) {

        ctx.response.body.push('main, call 1');
        return ctx;
    }).next(function (ctx) {

        ctx.response.body.push('main, call 2');
        return ctx;
    });

    let response : AxiosResponse<Data>;

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.data).toEqual([
            'group 1, throw 1',
            'group 1, catch 1',
            'group 2, throw 1',
            'group 1, catch 1',
            'main, call 1',
            'main, call 2'

        ]);

        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });


});
