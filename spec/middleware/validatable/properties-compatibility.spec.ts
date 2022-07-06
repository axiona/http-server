import Router from '../../../dist/router/standard.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation.js';
import OneGuard from './one-guard.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

let router =  BindToServer(server, new Router());

describe('validation', () => {

    describe('no context', ()=>{
        it('parameters', ()=>{

            router
                .add(ValidationParameters(() => true, ['request', 'body']))
                .add(function (ctx) {

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
                .add(Validation.Parameters(() => true, ['request', 'body']))
                .add(function (ctx) {

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
                .add(ValidationParameter({
                    validation: () => true,
                    properties: ['request', 'body'],
                })).add(function (ctx) {

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
                .add(Validation.Parameter({
                    validation: () => true,
                    properties: ['request', 'body'],
                })).add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .add(ValidationParameters(() => true, ['request', 'body']))
                .add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .add(Validation.Parameters(() => true, ['request', 'body']))
                .add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                }).add(ValidationParameter({
                validation: () => true,
            })).add(function (ctx) {

                let data : string|number|boolean = ctx.data;
                // @ts-expect-error
                let number : number = ctx.data;
                // @ts-expect-error
                let boolean : boolean = ctx.data;
                // @ts-expect-error
                let string : string = ctx.data;

                return ctx;
            });

            router
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                }).add(Validation.Parameter({
                validation: () => true,
            })).add(function (ctx) {

                let data : string|number|boolean = ctx.data;
                // @ts-expect-error
                let number : number = ctx.data;
                // @ts-expect-error
                let boolean : boolean = ctx.data;
                // @ts-expect-error
                let string : string = ctx.data;

                return ctx;
            });

        });
    });
});

describe('guard', () => {

    describe('no context', ()=>{
        it('parameters', ()=>{

            router
                .add(ValidationParameters(OneGuard, ['response', 'status'], undefined))
                .add(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .add(Validation.Parameters(OneGuard, ['response', 'status'], undefined))
                .add(function (ctx) {

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
                .add(ValidationParameter({
                    validation: OneGuard,
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .add(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .add(Validation.Parameter({
                    validation: OneGuard,
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .add(function (ctx) {

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

    describe('with context', ()=>{
        it('parameters', ()=>{

            router
                .add(ValidationParameters(OneGuard, ['response', 'status'], undefined))
                .add(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .add(Validation.Parameters(OneGuard, ['response', 'status'], undefined))
                .add(function (ctx) {

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
                .add(ValidationParameter({
                    validation: OneGuard,
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .add(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .add(Validation.Parameter({
                    validation: OneGuard,
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .add(function (ctx) {

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



