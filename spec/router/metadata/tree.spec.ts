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

    const callback1 = Object.assign(function (ctx) {

            called.push('callback 1');
            return ctx;
        },
        {
            register: (metadata) => {
                metadata.method.push('register 1');
                return metadata;
            }
        }
    );

    const callback2 = Object.assign(function (ctx) {

            called.push('callback 2');
            return ctx;
        },
        {
            register: (metadata) => {
                metadata.method.push('register 2');
                return metadata;
            }
        }
    );

    const router =  BindToServer(server, Router());

    let router1 = router.next(Object.assign(function (ctx) {

            called.push('1 1');
            return ctx;
        },
        {
            register: (metadata) => {
                metadata.method.push('1 1');
                return metadata;
            }
        }
    ));

    {
        router1.next(callback1);
        router1.next(callback2);
    }

    let router2 = router.next(Object.assign(function (ctx) {

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

    {
        router2.next(callback1);
        router2.next(callback2);
    }



    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}/path`).catch(fail).finally(done);
    });

    it('metadata', function () {
        expect(router.metadata.method).toEqual([]);
        expect(router.metadata.children[0].method).toEqual(['1 1']);

        expect(router.metadata.children[0].children[0].method).toEqual(['1 1', 'register 1']);
        expect(router.metadata.children[0].children[1].method).toEqual(['1 1', 'register 2']);

        expect(router.metadata.children[1].children[0].method).toEqual(['1 2', 'register 1']);
        expect(router.metadata.children[1].children[1].method).toEqual(['1 2', 'register 2']);
    });

    it('assert value', function () {

        expect(called).toEqual([
            '1 1',
            'callback 1',
            'callback 2',
            '1 2',
            'callback 1',
            'callback 2'

        ]);
    });
});
