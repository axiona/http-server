import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation.js';
import ContextDataGuard from './context-data-guard.js';
import Context from '../../../dist/context/context.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

const router =  BindToServer(server, Router());

describe('validatable', ()=>{

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidationParameters(() => true))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{data:number}> = ctx.data;
                    // @ts-expect-error
                    const boolean : Context<{data:boolean}> = ctx.data;
                    // @ts-expect-error
                    const string : Context<{data:string}> = ctx.data;
                    return ctx;
                });

            router
                .next(Validation.Parameters(() => true))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{data:number}> = ctx.data;
                    // @ts-expect-error
                    const boolean : Context<{data:boolean}> = ctx.data;
                    // @ts-expect-error
                    const string : Context<{data:string}> = ctx.data;
                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });
        describe('parameter', ()=>{

            router
                .next(ValidationParameter({validation: ()=>true}))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{data:number}> = ctx.data;
                    // @ts-expect-error
                    const boolean : Context<{data:boolean}> = ctx.data;
                    // @ts-expect-error
                    const string : Context<{data:string}> = ctx.data;
                    return ctx;
                });

            router
                .next(Validation.Parameter({validation: ()=>true}))
                .next(function (ctx) {

                    const data : Context = ctx;
                    // @ts-expect-error
                    const number : Context<{data:number}> = ctx.data;
                    // @ts-expect-error
                    const boolean : Context<{data:boolean}> = ctx.data;
                    // @ts-expect-error
                    const string : Context<{data:string}> = ctx.data;
                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });


    });

    describe('with context', ()=>{

        describe('parameters', ()=>{

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(ValidationParameters(() => true))
                .next(function (ctx) {

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

                })
                .next(Validation.Parameters(() => true))
                .next(function (ctx) {

                    const data : string|number|boolean = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const string : string = ctx.data;
                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });

        describe('parameter', ()=>{

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(ValidationParameter({validation: ()=>true}))
                .next(function (ctx) {

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

                })
                .next(Validation.Parameter({validation: ()=>true}))
                .next(function (ctx) {

                    const data : string|number|boolean = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const string : string = ctx.data;
                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });
    });
});

describe('guard', ()=>{

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidationParameters(ContextDataGuard))
                .next(function (ctx) {

                    const data : string = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;

                    return ctx;
                });

            router
                .next(Validation.Parameters(ContextDataGuard))
                .next(function (ctx) {

                    const data : string = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;

                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });


        describe('parameter', ()=>{

            router
                .next(ValidationParameter({validation:ContextDataGuard}))
                .next(function (ctx) {

                    const data : string = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;

                    return ctx;
                });

            router
                .next(Validation.Parameter({validation:ContextDataGuard}))
                .next(function (ctx) {

                    const data : string = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;

                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });
    });

    describe('with context', ()=>{

        describe('parameters', ()=>{

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(ValidationParameters(ContextDataGuard))
                .next(function (ctx) {

                    const data : string = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;

                    return ctx;
                });

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(Validation.Parameters(ContextDataGuard))
                .next(function (ctx) {

                    const data : string = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;

                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });


        describe('parameter', ()=>{

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(ValidationParameter({validation:ContextDataGuard}))
                .next(function (ctx) {

                    const data : string = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;

                    return ctx;
                });

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(Validation.Parameter({validation:ContextDataGuard}))
                .next(function (ctx) {

                    const data : string = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;

                    return ctx;
                });
            it('',()=>expect(true).toBeTrue());
        });
    });

});


