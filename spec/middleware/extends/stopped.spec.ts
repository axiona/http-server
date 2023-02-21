import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Router from '../../../dist/router/middleware.js';
import Route from '../../../dist/router/router.js';
import Axios, {AxiosResponse} from 'axios';
import Context from '../../../dist/context/context.js';
import util from "util";
import {OmitParameters} from '@alirya/object/omit.js';

describe('multi', () => {

    type Data = string[];

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    const router =  BindToServer(server, Router(function Main (context) : Context<{}, {body:string[]}>  {

        context.response.body = [];
        return context as Context<{}, {body:string[]}>;
    }));


    router.extends(r=>r.next(function Group1Call1 (ctx) {

            ctx.response.body.push('group 1, call 1');
            return ctx;
        }).next(function Group1Stop1 (ctx)  {

            ctx.response.body.push('group 1, stop 1');
            return undefined as any as Context<{}, {body:string[]}>;

        })
    ).next(function MainCall1(ctx) {

        ctx.response.body.push('main, call 1');
        return ctx;

    });

    function dump(route: Route) : any {

        const data =  OmitParameters(Object.assign({}, route), 'metadata');

        data.children = data.children.map(dump);

        return data;
    }

    let response : AxiosResponse<Data>;

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.data).toEqual([
                'group 1, call 1',
                'group 1, stop 1',
            ]
        );
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });


});
