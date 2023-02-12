import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Validator, {ValidatorParameter, ValidatorParameters} from '../../../dist/middleware/validator.js';
import Stop from '../../../dist/middleware/stop.js';
import OneGuard from './one-validator.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

const router =  BindToServer(server, Router());

describe('guard', () => {

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidatorParameters(OneGuard(), ['response', 'status'], Stop()))
                .next(function (ctx) {

                    const number : number = ctx.response.status;
                    const one : 1 = ctx.response.status;
                    // @ts-expect-error
                    const two : 2 = ctx.response.status;
                    // @ts-expect-error
                    const string : string = ctx.response.status;

                    return ctx;
                });

            router
                .next(ValidatorParameters(OneGuard(), ['a', 'b'], Stop()))
                .next(function (ctx) {

                    const number : number = ctx.a.b;
                    const one : 1 = ctx.a.b;
                    // @ts-expect-error
                    const two : 2 = ctx.a.b;
                    // @ts-expect-error
                    const string : string = ctx.a.b;

                    return ctx;
                });

            router
                .next(Validator.Parameters(OneGuard(), ['a', 'b'], Stop()))
                .next(function (ctx) {

                    const number : number = ctx.a.b;
                    const one : 1 = ctx.a.b;
                    // @ts-expect-error
                    const two : 2 = ctx.a.b;
                    // @ts-expect-error
                    const string : string = ctx.a.b;

                    return ctx;
                });

            it('',()=>expect(true).toBeTrue());
        });

        describe('parameter', ()=>{

            router
                .next(ValidatorParameter({
                    validator: OneGuard(),
                    properties: ['a', 'b'],
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    const number : number = ctx.a.b;
                    const one : 1 = ctx.a.b;
                    // @ts-expect-error
                    const two : 2 = ctx.a.b;
                    // @ts-expect-error
                    const string : string = ctx.a.b;

                    return ctx;
                });

            router
                .next(Validator.Parameter({
                    validator: OneGuard(),
                    properties: ['response', 'body'],
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    const number : number = ctx.response.body;
                    const one : 1 = ctx.response.body;
                    // @ts-expect-error
                    const two : 2 = ctx.response.body;
                    // @ts-expect-error
                    const string : string = ctx.response.body;

                    return ctx;
                });

            it('',()=>expect(true).toBeTrue());
        });
    });
    describe('with context', ()=>{
        describe('parameters', ()=>{
            router
                .next(ValidatorParameters(OneGuard(), ['response', 'status'], Stop()))
                .next(function (ctx) {

                    const number : number = ctx.response.status;
                    const one : 1 = ctx.response.status;
                    // @ts-expect-error
                    const two : 2 = ctx.response.status;
                    // @ts-expect-error
                    const string : string = ctx.response.status;

                    return ctx;
                });

            router
                .next(Validator.Parameters(OneGuard(), ['response', 'status'], Stop()))
                .next(function (ctx) {

                    const number : number = ctx.response.status;
                    const one : 1 = ctx.response.status;
                    // @ts-expect-error
                    const two : 2 = ctx.response.status;
                    // @ts-expect-error
                    const string : string = ctx.response.status;

                    return ctx;
                });

            it('',()=>expect(true).toBeTrue());

        });
        describe('parameter', ()=>{
            router
                .next(ValidatorParameter({
                    validator: OneGuard(),
                    properties: ['response', 'status'],
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    const number : number = ctx.response.status;
                    const one : 1 = ctx.response.status;
                    // @ts-expect-error
                    const two : 2 = ctx.response.status;
                    // @ts-expect-error
                    const string : string = ctx.response.status;

                    return ctx;
                });

            router
                .next(Validator.Parameter({
                    validator: OneGuard(),
                    properties: ['response', 'status'],
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    const number : number = ctx.response.status;
                    const one : 1 = ctx.response.status;
                    // @ts-expect-error
                    const two : 2 = ctx.response.status;
                    // @ts-expect-error
                    const string : string = ctx.response.status;

                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });
    });

});



