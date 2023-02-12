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


    router.extends(r=>r
            .next(function (ctx) {

                ctx.response.body.push('group 1, call 1');
                return ctx;
            })
            .next(function (ctx) {

                ctx.response.body.push('group 1, call 2');
                return ctx;
            })
    ).extends(r=>r
            .next(function (ctx) {

                ctx.response.body.push('group 2, call 1');
                return ctx;
            })
            .next(function (ctx) {

                ctx.response.body.push('group 2, call 2');
                return ctx;
            })
    );

    let response : AxiosResponse<Data>;

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.data).toEqual([
                'group 1, call 1',
                'group 1, call 2',
                'group 2, call 1',
                'group 2, call 2'
            ]
        );
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });


});
