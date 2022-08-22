import Router from '../../../dist/router/standard';
import Method from '../../../dist/middleware/method';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import {PathParameters} from '../../../dist/middleware/path';
import AutoOptions from '../../../dist/middleware/auto-options';
import {ShuffleParameters} from '@alirya/array/shuffle';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('ordered', () => {

    let response : AxiosResponse<{name : string, address : string}>;

    let mapped : Map<string, string[]> = new Map<string, string[]>();
    mapped.set('/path1/child1', ['POST', 'GET', 'PATCH', 'DELETE', 'PUT']);
    // mapped.set('/path2/child2', ['GET', 'PATCH', 'DELETE', 'PUT']);
    // mapped.set('/path3/child3', ['PATCH', 'DELETE', 'PUT']);
    // mapped.set('/path4/child4', ['DELETE', 'PUT']);
    // mapped.set('/path5/child5', ['PUT']);
    // mapped.set('/path6/child6', ['CUSTOM']);

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());

    it('add request', ()=>{

        router.add(AutoOptions());

        let list : {path:string, method:string}[] = [];

        for (const [path, methods] of mapped) {

            for (const method of methods) {

                list.push({method, path});
            }
        }

        list = ShuffleParameters(list);

        for (const {path, method} of list) {

            router.add(Method(method)).add(PathParameters(path)).add(ctx=>ctx);
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
