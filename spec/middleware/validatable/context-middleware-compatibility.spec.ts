import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation.js';
import Stop from '../../../dist/middleware/stop.js';
import ContextDataGuard from './context-data-guard.js';
import Context from '../../../dist/context/context.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


const server = Server();

const router =  BindToServer(server, Router());

describe('validation', () => {

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidationParameters(() => true, undefined, Stop()))
                .next(function (ctx) {

                    // @ts-expect-error
                    const number : number = ctx.request.body;
                    // @ts-expect-error
                    const boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    const string : string = ctx.request.body;

                    return ctx;
                });

            router
                .next(Validation.Parameters(() => true, undefined, Stop()))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    const boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    const string : Context<{ data :string }> = ctx;

                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });

        describe('parameter', ()=>{

            router
                .next(ValidationParameter({
                    validation: () => true,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    const boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    const string : Context<{ data :string }> = ctx;

                    return ctx;
                });

            router
                .next(Validation.Parameter({
                    validation: () => true,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    const boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    const string : Context<{ data :string }> = ctx;

                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });
    });

    describe('context', ()=>{

        describe('parameters', ()=>{

            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(ValidationParameters(() => true, undefined, Stop()))
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
                .next(Validation.Parameters(() => true, undefined, Stop()))
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

            it('',()=>expect(true).toBeTrue());
        });

        describe('parameter', ()=>{
            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(ValidationParameter({
                    validation: () => true,
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
            it('',()=>expect(true).toBeTrue());
        });
    });


});

describe('guard', () => {

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidationParameters(ContextDataGuard, undefined, Stop()))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    const boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    const string : Context<{ data :string }> = ctx;

                    return ctx;
                });

            router
                .next(Validation.Parameters(ContextDataGuard, undefined, Stop()))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    const boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    const string : Context<{ data :string }> = ctx;

                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });


        describe('parameter', ()=>{

            router
                .next(ValidationParameter({
                    validation: ContextDataGuard,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    const boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    const string : Context<{ data :string }> = ctx;

                    return ctx;
                });

            router
                .next(Validation.Parameter({
                    validation: ContextDataGuard,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    const boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    const string : Context<{ data :string }> = ctx;

                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });
    });

    describe('with context', ()=>{

        describe('parameters', ()=>{

            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(ValidationParameters(ContextDataGuard, undefined, Stop()))
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
                .next(Validation.Parameters(ContextDataGuard, undefined, Stop()))
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
            it('',()=>expect(true).toBeTrue());
        });

        describe('parameter', ()=>{
            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(ValidationParameter({
                    validation: ContextDataGuard,
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
                    validation: ContextDataGuard,
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
            it('',()=>expect(true).toBeTrue());
        });
    });

});



