import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation.js';
import Context from '../../../dist/context/context.js';
import OneGuard from './one-guard.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

const router =  BindToServer(server, Router());

describe('validation', () => {

    describe('no context', ()=>{

        it('parameters', ()=>{

            router
                .next(ValidationParameters(() => true, ['request', 'body']))
                .next(function (ctx) {

                    const unknown : unknown = ctx.request.body;
                    // @ts-expect-error
                    const data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    const number : number = ctx.request.body;
                    // @ts-expect-error
                    const boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    const string : string = ctx.request.body;

                    return ctx;
                });

            router
                .next(Validation.Parameters(() => true, ['request', 'body']))
                .next(function (ctx) {

                    const unknown : unknown = ctx.request.body;
                    // @ts-expect-error
                    const data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    const number : number = ctx.request.body;
                    // @ts-expect-error
                    const boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    const string : string = ctx.request.body;

                    return ctx;
                });

        });

        it('parameter', ()=>{

            router
                .next(ValidationParameter({
                    validation: () => true,
                    properties: ['request', 'body'],
                })).next(function (ctx) {

                const unknown : unknown = ctx.request.body;
                // @ts-expect-error
                const data : string|number|boolean = ctx.request.body;
                // @ts-expect-error
                const number : number = ctx.request.body;
                // @ts-expect-error
                const boolean : boolean = ctx.request.body;
                // @ts-expect-error
                const string : string = ctx.request.body;

                return ctx;
            });

            router
                .next(Validation.Parameter({
                    validation: () => true,
                    properties: ['request', 'body'],
                })).next(function (ctx) {

                const unknown : unknown = ctx.request.body;
                // @ts-expect-error
                const data : string|number|boolean = ctx.request.body;
                // @ts-expect-error
                const number : number = ctx.request.body;
                // @ts-expect-error
                const boolean : boolean = ctx.request.body;
                // @ts-expect-error
                const string : string = ctx.request.body;

                return ctx;
            });
        });

        it('',()=>expect(true).toBeTrue());
    });
    describe('with context', ()=>{
        it('parameters', ()=>{
            router
                .next(function (context) : Context<{body : string|number|boolean}> {

                    return Object.assign(context, {request: {body : 'a' }});

                })

                .next(ValidationParameters((data: string|number|boolean) => {
                    const string: string|number|boolean = data;
                    return true;
                }, ['request', 'body']))
                .next(function (ctx) {

                    const data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    const number : number = ctx.request.body;
                    // @ts-expect-error
                    const boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    const string : string = ctx.request.body;

                    return ctx;
                });

            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(Validation.Parameters(() => true, ['request', 'body']))
                .next(function (ctx) {

                    const data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    const number : number = ctx.request.body;
                    // @ts-expect-error
                    const boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    const string : string = ctx.request.body;

                    return ctx;
                });
        });


        it('parameter', ()=>{
            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                }).next(ValidationParameter({
                validation: () => true,
            })).next(function (ctx) {

                const data : string|number|boolean = ctx.data;
                // @ts-expect-error
                const number : number = ctx.data;
                // @ts-expect-error
                const boolean : boolean = ctx.data;
                // @ts-expect-error
                const string : string = ctx.data;

                return ctx;
            });

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                }).next(Validation.Parameter({
                validation: () => true,
            })).next(function (ctx) {

                const data : string|number|boolean = ctx.data;
                // @ts-expect-error
                const number : number = ctx.data;
                // @ts-expect-error
                const boolean : boolean = ctx.data;
                // @ts-expect-error
                const string : string = ctx.data;

                return ctx;
            });

        });

        it('',()=>expect(true).toBeTrue());
    });
});

describe('guard', () => {

    describe('no context', ()=>{
        it('parameters', ()=>{

            router
                .next(ValidationParameters(OneGuard, ['response', 'status'], undefined))
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
                .next(Validation.Parameters(OneGuard, ['response', 'status'], undefined))
                .next(function (ctx) {

                    const number : number = ctx.response.status;
                    const one : 1 = ctx.response.status;
                    // @ts-expect-error
                    const two : 2 = ctx.response.status;
                    // @ts-expect-error
                    const string : string = ctx.response.status;

                    return ctx;
                });
        });

        it('parameter', ()=>{

            router
                .next(ValidationParameter({
                    validation: OneGuard,
                    properties: ['response', 'status'],
                    invalid: undefined
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
                .next(Validation.Parameter({
                    validation: OneGuard,
                    properties: ['response', 'status'],
                    invalid: undefined
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
        });

        it('',()=>expect(true).toBeTrue());
    });

    describe('with context', ()=>{
        it('parameters', ()=>{

            router
                .next(ValidationParameters(OneGuard, ['response', 'status'], undefined))
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
                .next(Validation.Parameters(OneGuard, ['response', 'status'], undefined))
                .next(function (ctx) {

                    const number : number = ctx.response.status;
                    const one : 1 = ctx.response.status;
                    // @ts-expect-error
                    const two : 2 = ctx.response.status;
                    // @ts-expect-error
                    const string : string = ctx.response.status;

                    return ctx;
                });

        });
        it('parameter', ()=>{

            router
                .next(ValidationParameter({
                    validation: OneGuard,
                    properties: ['response', 'status'],
                    invalid: undefined
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
                .next(Validation.Parameter({
                    validation: OneGuard,
                    properties: ['response', 'status'],
                    invalid: undefined
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

        });

        it('',()=>expect(true).toBeTrue());
    });

});



