import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation';
import Stop from '../../../dist/middleware/stop';
import ContextDataGuard from './context-data-guard';
import Context from '../../../dist/context/context';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


const server = Server();

let router =  BindToServer(server, new Router());

describe('validation', () => {

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .add(ValidationParameters(() => true, undefined, Stop()))
                .add(function (ctx) {

                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

                    return ctx;
                });

            router
                .add(Validation.Parameters(() => true, undefined, Stop()))
                .add(function (ctx) {

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
                .add(ValidationParameter({
                    validation: () => true,
                    invalid : Stop()
                }))
                .add(function (ctx) {

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
                .add(Validation.Parameter({
                    validation: () => true,
                    invalid : Stop()
                }))
                .add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .add(ValidationParameters(() => true, undefined, Stop()))
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
                .add(Validation.Parameters(() => true, undefined, Stop()))
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

        describe('parameter', ()=>{
            router
                .add(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .add(ValidationParameter({
                    validation: () => true,
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

        describe('parameters', ()=>{

            router
                .add(ValidationParameters(ContextDataGuard, undefined, Stop()))
                .add(function (ctx) {

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
                .add(Validation.Parameters(ContextDataGuard, undefined, Stop()))
                .add(function (ctx) {

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
                .add(ValidationParameter({
                    validation: ContextDataGuard,
                    invalid : Stop()
                }))
                .add(function (ctx) {

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
                .add(Validation.Parameter({
                    validation: ContextDataGuard,
                    invalid : Stop()
                }))
                .add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .add(ValidationParameters(ContextDataGuard, undefined, Stop()))
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
                .add(Validation.Parameters(ContextDataGuard, undefined, Stop()))
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

        describe('parameter', ()=>{
            router
                .add(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .add(ValidationParameter({
                    validation: ContextDataGuard,
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
                    validation: ContextDataGuard,
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



