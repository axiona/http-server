import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation';
import Stop from '../../../dist/middleware/stop';
import OneGuard from './one-guard';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


const server = Server();

let router =  BindToServer(server, new Router());

describe('validation', () => {

    describe('no context', ()=>{

        it('parameters', ()=>{

            router
                .add(ValidationParameters(() => true, ['request', 'body'], Stop()))
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
                .add(Validation.Parameters(() => true, ['request', 'body'], Stop()))
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
                    properties : ['request', 'body'],
                    invalid : Stop()
                }))
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
                .add(Validation.Parameter({
                    validation: () => true,
                    properties : ['request', 'body'],
                    invalid : Stop()
                }))
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
    });

    describe('with context', ()=>{
        it('parameters', ()=>{

            router
                .add(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .add(ValidationParameters(() => true, ['request', 'body'], Stop()))
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
                .add(Validation.Parameters(() => true, ['request', 'body'], Stop()))
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

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .add(function (ctx) {

                    return ctx;

                })
                .add(ValidationParameter({
                    validation: () => true,
                    properties : ['request', 'body'],
                    invalid : Stop()
                }))
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
                .add(Validation.Parameter({
                    validation: () => true,
                    properties : ['request', 'body'],
                    invalid : Stop()
                }))
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
    });


});

describe('guard', () => {

    describe('no context', ()=>{

        it('parameters', ()=>{

            router
                .add(ValidationParameters(OneGuard, ['response', 'status'], Stop()))
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
                .add(ValidationParameters(OneGuard, ['a', 'b'], Stop()))
                .add(function (ctx) {

                    let number : number = ctx.a.b;
                    let one : 1 = ctx.a.b;
                    // @ts-expect-error
                    let two : 2 = ctx.a.b;
                    // @ts-expect-error
                    let string : string = ctx.a.b;

                    return ctx;
                });

            router
                .add(Validation.Parameters(OneGuard, ['a', 'b'], Stop()))
                .add(function (ctx) {

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
                .add(ValidationParameter({
                    validation: OneGuard,
                    properties: ['a', 'b'],
                    invalid : Stop()
                }))
                .add(function (ctx) {

                    let number : number = ctx.a.b;
                    let one : 1 = ctx.a.b;
                    // @ts-expect-error
                    let two : 2 = ctx.a.b;
                    // @ts-expect-error
                    let string : string = ctx.a.b;

                    return ctx;
                });

            router
                .add(Validation.Parameter({
                    validation: OneGuard,
                    properties: ['response', 'body'],
                    invalid : Stop()
                }))
                .add(function (ctx) {

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
                .add(ValidationParameters(OneGuard, ['response', 'status'], Stop()))
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
                .add(Validation.Parameters(OneGuard, ['response', 'status'], Stop()))
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
                    invalid : Stop()
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
                    invalid : Stop()
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



