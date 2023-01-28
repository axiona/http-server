import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation';
import Stop from '../../../dist/middleware/stop';
import OneGuard from './one-guard';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


const server = Server();

let router =  BindToServer(server, Router());

describe('validation', () => {

    describe('no context', ()=>{

        it('parameters', ()=>{

            router
                .next(ValidationParameters(() => true, ['request', 'body'], Stop()))
                .next(function (ctx) {

                    let unknown : unknown = ctx.request.body;
                    // @ts-expect-error
                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

                    return ctx;
                });

            router
                .next(Validation.Parameters(() => true, ['request', 'body'], Stop()))
                .next(function (ctx) {

                    let unknown : unknown = ctx.request.body;
                    // @ts-expect-error
                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

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

                    let unknown : unknown = ctx.request.body;
                    // @ts-expect-error
                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

                    return ctx;
                });

            router
                .next(Validation.Parameter({
                    validation: () => true,
                    properties : ['request', 'body'],
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let unknown : unknown = ctx.request.body;
                    // @ts-expect-error
                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

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

                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

                    return ctx;
                });

            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(Validation.Parameters(() => true, ['request', 'body'], Stop()))
                .next(function (ctx) {

                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

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

                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

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

                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

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

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .next(ValidationParameters(OneGuard, ['a', 'b'], Stop()))
                .next(function (ctx) {

                    let number : number = ctx.a.b;
                    let one : 1 = ctx.a.b;
                    // @ts-expect-error
                    let two : 2 = ctx.a.b;
                    // @ts-expect-error
                    let string : string = ctx.a.b;

                    return ctx;
                });

            router
                .next(Validation.Parameters(OneGuard, ['a', 'b'], Stop()))
                .next(function (ctx) {

                    let number : number = ctx.a.b;
                    let one : 1 = ctx.a.b;
                    // @ts-expect-error
                    let two : 2 = ctx.a.b;
                    // @ts-expect-error
                    let string : string = ctx.a.b;

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

                    let number : number = ctx.a.b;
                    let one : 1 = ctx.a.b;
                    // @ts-expect-error
                    let two : 2 = ctx.a.b;
                    // @ts-expect-error
                    let string : string = ctx.a.b;

                    return ctx;
                });

            router
                .next(Validation.Parameter({
                    validation: OneGuard,
                    properties: ['response', 'body'],
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let number : number = ctx.response.body;
                    let one : 1 = ctx.response.body;
                    // @ts-expect-error
                    let two : 2 = ctx.response.body;
                    // @ts-expect-error
                    let string : string = ctx.response.body;

                    return ctx;
                });
        });
    });
    describe('with context', ()=>{
        it('parameters', ()=>{
            router
                .next(ValidationParameters(OneGuard, ['response', 'status'], Stop()))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .next(Validation.Parameters(OneGuard, ['response', 'status'], Stop()))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

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

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .next(Validation.Parameter({
                    validation: OneGuard,
                    properties: ['response', 'status'],
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

        });
    });

});



