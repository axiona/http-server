import Router from '../../../dist/router/middleware.js';
import Method from '../../../dist/middleware/method.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import {PathParameters} from '../../../dist/middleware/path.js';
import AutoOptions from '../../../dist/middleware/auto-options.js';
import {ShuffleParameters} from '@axiona/array/shuffle.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('ordered', () => {

    let response : AxiosResponse<{name : string, address : string}>;

    const mapped : Map<string, string[]> = new Map<string, string[]>();
    mapped.set('/path1/child1', ['POST', 'GET', 'PATCH', 'DELETE', 'PUT']);
    mapped.set('/path2/child2', ['GET', 'PATCH', 'DELETE', 'PUT']);
    mapped.set('/path3/child3', ['PATCH', 'DELETE', 'PUT']);
    mapped.set('/path4/child4', ['DELETE', 'PUT']);
    mapped.set('/path5/child5', ['PUT']);
    mapped.set('/path6/child6', ['CUSTOM']);

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    it('add request', ()=>{

        const next = router.next(AutoOptions());

        let list : {path:string, method:string}[] = [];

        for (const [path, methods] of mapped) {

            for (const method of methods) {

                list.push({method, path});
            }
        }

        list = ShuffleParameters(list);

        for (const {path, method} of list) {

            next.next(Method(method)).next(PathParameters(path)).next(ctx=>ctx);
        }

    });


    for (const [path, methods] of mapped) {

        it(`send request ${path}`, function (done) {

            Axios.request({
                method : 'OPTIONS',
                url : `http://localhost:${server.config.port}/${path}`
        }).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it(`assert value ${path}`, function () {

            expect(response.headers.allow.split(', ').sort().join(', ')).toEqual(methods.sort().join((', ')));
            expect(response.status).toEqual(204);
            expect(response.statusText).toEqual('No Content');
        });

    }

});
