import Server from "../../server";
import BindToServer from "../../../dist/router/append-server";
import Router from "../../../dist/router/middleware";
import Route from "../../../dist/router/router";
import Axios, {AxiosResponse} from "axios";
import Context from "../../../dist/context/context";
import util from "util";
import {OmitParameters} from "../../../../object/dist/omit";

describe('multi', () => {

    type Data = string[];

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, Router(function Main (context) : Context<{}, {body:string[]}>  {

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

        let data =  OmitParameters(Object.assign({}, route), 'metadata');

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
