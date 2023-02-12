import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Router from '../../../dist/router/middleware.js';
import Axios from 'axios';
import * as util from "util";
import Catch from '../../../dist/catch/catch.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('no throw', function () {

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const called : string[] = [];

    const catch1 : Catch = Object.assign(function (ctx, error) {

            called.push('catch 1');
        },
        {
            register: (metadata) => {
                metadata.method.push('catch 1');
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

    const router1 = router.next(Object.assign(function (ctx) {

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
        router1.catch(catch1).next(callback2);
    }

    const router2 = router.next(Object.assign(function (ctx) {

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
        router2.extends(r=>r.catch(catch1).next(callback2));
    }



    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}/path`).catch(fail).finally(done);
    });

    it('metadata', function () {

        expect(router.metadata.method).toEqual([]);

        expect(router.metadata.children[0].method).toEqual(['1 1']);
        expect(router.metadata.children[0].children[0].method).toEqual(['1 1', 'catch 1']);
        expect(router.metadata.children[0].children[0].children[0].method).toEqual(['1 1', 'catch 1', 'register 2']);

        expect(router.metadata.children[1].method).toEqual(['1 2']);
        expect(router.metadata.children[1].children[0].method).toEqual(['1 2', 'catch 1']);
        expect(router.metadata.children[1].children[0].children[0].method).toEqual(['1 2', 'catch 1', 'register 2']);
    });

    it('assert value', function () {

        expect(called).toEqual([
            '1 1',
            // 'callback 1',
            'callback 2',
            '1 2',
            // 'callback 1',
            'callback 2'

        ]);
    });
});


describe('throw', function () {

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const called : string[] = [];

    const catch1 : Catch = Object.assign(function (ctx, error) {

            called.push('catch 1');
        },
        {
            register: (metadata) => {
                metadata.method.push('catch 1');
                return metadata;
            }
        }
    );

    const callback2 = Object.assign(function (ctx) {

            called.push('callback 2');

            throw new Error('callback 2 error');
        },
        {
            register: (metadata) => {
                metadata.method.push('register 2');
                return metadata;
            }
        }
    );

    const router =  BindToServer(server, Router());

    const router1 = router.next(Object.assign(function (ctx) {

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
        router1.catch(catch1).next(callback2);
    }

    const router2 = router.next(Object.assign(function (ctx) {

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
        router2.extends(r=>r.catch(catch1).next(callback2));
    }



    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}/path`).catch(fail).finally(done);
    });

    it('metadata', function () {

        expect(router.metadata.method).toEqual([]);

        expect(router.metadata.children[0].method).toEqual(['1 1']);
        expect(router.metadata.children[0].children[0].method).toEqual(['1 1', 'catch 1']);
        expect(router.metadata.children[0].children[0].children[0].method).toEqual(['1 1', 'catch 1', 'register 2']);

        expect(router.metadata.children[1].method).toEqual(['1 2']);
        expect(router.metadata.children[1].children[0].method).toEqual(['1 2', 'catch 1']);
        expect(router.metadata.children[1].children[0].children[0].method).toEqual(['1 2', 'catch 1', 'register 2']);
    });

    it('assert value', function () {

        expect(called).toEqual([
            '1 1',
            'callback 2',
            'catch 1',
            '1 2',
            'callback 2',
            'catch 1',
        ]);
    });
});
