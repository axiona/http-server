import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation';
import Stop from '../../../dist/middleware/stop';
import ContextDataGuard from './context-data-guard';
import Context from '../../../dist/context/context';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


const server = Server();

let router =  BindToServer(server, Router());

describe('validation', () => {

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidationParameters(() => true, undefined, Stop()))
                .next(function (ctx) {

                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

                    return ctx;
                });

            router
                .next(Validation.Parameters(() => true, undefined, Stop()))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });

        });

        describe('parameter', ()=>{

            router
                .next(ValidationParameter({
                    validation: () => true,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });

            router
                .next(Validation.Parameter({
                    validation: () => true,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });
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
                .next(Validation.Parameters(() => true, undefined, Stop()))
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

        describe('parameters', ()=>{

            router
                .next(ValidationParameters(ContextDataGuard, undefined, Stop()))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });

            router
                .next(Validation.Parameters(ContextDataGuard, undefined, Stop()))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });

        });


        describe('parameter', ()=>{

            router
                .next(ValidationParameter({
                    validation: ContextDataGuard,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });

            router
                .next(Validation.Parameter({
                    validation: ContextDataGuard,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });
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
                .next(Validation.Parameters(ContextDataGuard, undefined, Stop()))
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
                    validation: ContextDataGuard,
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



