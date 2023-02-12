import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation.js';
import Stop from '../../../dist/middleware/stop.js';
import OneGuard from './one-guard.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


const server = Server();

const router =  BindToServer(server, Router());

describe('validation', () => {

    describe('no context', ()=>{

        it('parameters', ()=>{

            router
                .next(ValidationParameters(() => true, ['request', 'body'], Stop()))
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
                .next(Validation.Parameters(() => true, ['request', 'body'], Stop()))
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
                    properties : ['request', 'body'],
                    invalid : Stop()
                }))
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
                .next(Validation.Parameter({
                    validation: () => true,
                    properties : ['request', 'body'],
                    invalid : Stop()
                }))
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
    });

    describe('with context', ()=>{
        it('parameters', ()=>{

            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(ValidationParameters(() => true, ['request', 'body'], Stop()))
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
                .next(Validation.Parameters(() => true, ['request', 'body'], Stop()))
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

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(function (ctx) {

                    return ctx;

                })
                .next(ValidationParameter({
                    validation: () => true,
                    properties : ['request', 'body'],
                    invalid : Stop()
                }))
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
                .next(Validation.Parameter({
                    validation: () => true,
                    properties : ['request', 'body'],
                    invalid : Stop()
                }))
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
    });


});

describe('guard', () => {

    describe('no context', ()=>{

        it('parameters', ()=>{

            router
                .next(ValidationParameters(OneGuard, ['response', 'status'], Stop()))
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
                .next(ValidationParameters(OneGuard, ['a', 'b'], Stop()))
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
                .next(Validation.Parameters(OneGuard, ['a', 'b'], Stop()))
                .next(function (ctx) {

                    const number : number = ctx.a.b;
                    const one : 1 = ctx.a.b;
                    // @ts-expect-error
                    const two : 2 = ctx.a.b;
                    // @ts-expect-error
                    const string : string = ctx.a.b;

                    return ctx;
                });
        });

        it('parameter', ()=>{

            router
                .next(ValidationParameter({
                    validation: OneGuard,
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
                .next(Validation.Parameter({
                    validation: OneGuard,
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
        });
    });
    describe('with context', ()=>{
        it('parameters', ()=>{
            router
                .next(ValidationParameters(OneGuard, ['response', 'status'], Stop()))
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
                .next(Validation.Parameters(OneGuard, ['response', 'status'], Stop()))
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
                .next(Validation.Parameter({
                    validation: OneGuard,
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

        });
    });

});



