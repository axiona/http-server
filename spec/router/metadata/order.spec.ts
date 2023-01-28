import Server from "../../server";
import BindToServer from "../../../dist/router/append-server";
import Router from "../../../dist/router/middleware";
import Axios from "axios";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('basic', function () {

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let called : string[] = [];

    const router =  BindToServer(server, Router());

    router.next(Object.assign(function (ctx) {

            called.push('1 1');
            return ctx;
        },
        {
            register: (metadata) => {
                metadata.method.push('1 1');
                return metadata;
            }
        }
    )).next(Object.assign(function (ctx) {

            called.push('1 1 1');
            return ctx;
        },
        {
            register: (metadata) => {
                metadata.method.push('1 1 1');
                return metadata;
            }
        }
    )).next(Object.assign(function (ctx) {

            called.push('1 1 1 1');
            return ctx;
        },
        {
            register: (metadata) => {
                metadata.method.push('1 1 1 1');
                return metadata;
            }
        }
    ));

    router.next(Object.assign(function (ctx) {

            ctx.status = 204;
            called.push('1 2');
            return ctx;
        },
        {
            register: (metadata) => {
                metadata.method.push('1 2');
                return metadata;
            }
        }
    ));

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}/path`).catch(fail).finally(done);
    });

    it('metadata', function () {

        expect(router.metadata.method).toEqual([]);
        expect(router.metadata.children[0].method).toEqual(['1 1']);
        expect(router.metadata.children[0].children[0].method).toEqual(['1 1', '1 1 1']);
        expect(router.metadata.children[0].children[0].children[0].method).toEqual(['1 1', '1 1 1', '1 1 1 1']);

        expect(router.metadata.children[1].method).toEqual(['1 2']);

    });

    it('assert value', function () {

        expect(called).toEqual([
            '1 1',
            '1 1 1',
            '1 1 1 1',
            '1 2'
        ]);
    });
});
