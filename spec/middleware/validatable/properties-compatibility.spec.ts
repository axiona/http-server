import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation';
import Context from '../../../dist/context/context';
import OneGuard from './one-guard';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

let router =  BindToServer(server, Router());

describe('validation', () => {

    describe('no context', ()=>{

        it('parameters', ()=>{

            router
                .next(ValidationParameters(() => true, ['request', 'body']))
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
                .next(Validation.Parameters(() => true, ['request', 'body']))
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
                    properties: ['request', 'body'],
                })).next(function (ctx) {

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
                    properties: ['request', 'body'],
                })).next(function (ctx) {

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
                .next(function (context) : Context<{body : string|number|boolean}> {

                    return Object.assign(context, {request: {body : 'a' }});

                })

                .next(ValidationParameters((data: string|number|boolean) => {
                    let string: string|number|boolean = data;
                    return true;
                }, ['request', 'body']))
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
                .next(Validation.Parameters(() => true, ['request', 'body']))
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

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                }).next(ValidationParameter({
                validation: () => true,
            })).next(function (ctx) {

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
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                }).next(Validation.Parameter({
                validation: () => true,
            })).next(function (ctx) {

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
                .next(ValidationParameters(OneGuard, ['response', 'status'], undefined))
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
                .next(Validation.Parameters(OneGuard, ['response', 'status'], undefined))
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
                    invalid: undefined
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
                    invalid: undefined
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

    describe('with context', ()=>{
        it('parameters', ()=>{

            router
                .next(ValidationParameters(OneGuard, ['response', 'status'], undefined))
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
                .next(Validation.Parameters(OneGuard, ['response', 'status'], undefined))
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
                    invalid: undefined
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
                    invalid: undefined
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



