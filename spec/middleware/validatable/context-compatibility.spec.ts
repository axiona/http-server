import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation';
import ContextDataGuard from './context-data-guard';
import Context from '../../../dist/context/context';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

let router =  BindToServer(server, Router());

describe('validatable', ()=>{

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidationParameters(() => true))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{data:number}> = ctx.data;
                    // @ts-expect-error
                    let boolean : Context<{data:boolean}> = ctx.data;
                    // @ts-expect-error
                    let string : Context<{data:string}> = ctx.data;
                    return ctx;
                });

            router
                .next(Validation.Parameters(() => true))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{data:number}> = ctx.data;
                    // @ts-expect-error
                    let boolean : Context<{data:boolean}> = ctx.data;
                    // @ts-expect-error
                    let string : Context<{data:string}> = ctx.data;
                    return ctx;
                });

        });
        describe('parameter', ()=>{

            router
                .next(ValidationParameter({validation: ()=>true}))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{data:number}> = ctx.data;
                    // @ts-expect-error
                    let boolean : Context<{data:boolean}> = ctx.data;
                    // @ts-expect-error
                    let string : Context<{data:string}> = ctx.data;
                    return ctx;
                });

            router
                .next(Validation.Parameter({validation: ()=>true}))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{data:number}> = ctx.data;
                    // @ts-expect-error
                    let boolean : Context<{data:boolean}> = ctx.data;
                    // @ts-expect-error
                    let string : Context<{data:string}> = ctx.data;
                    return ctx;
                });
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

                })
                .next(Validation.Parameters(() => true))
                .next(function (ctx) {

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

        describe('parameter', ()=>{

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(ValidationParameter({validation: ()=>true}))
                .next(function (ctx) {

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

                })
                .next(Validation.Parameter({validation: ()=>true}))
                .next(function (ctx) {

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

describe('guard', ()=>{

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidationParameters(ContextDataGuard))
                .next(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

            router
                .next(Validation.Parameters(ContextDataGuard))
                .next(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

        });


        describe('parameter', ()=>{

            router
                .next(ValidationParameter({validation:ContextDataGuard}))
                .next(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

            router
                .next(Validation.Parameter({validation:ContextDataGuard}))
                .next(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });
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

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(Validation.Parameters(ContextDataGuard))
                .next(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });
        });


        describe('parameter', ()=>{

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(ValidationParameter({validation:ContextDataGuard}))
                .next(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(Validation.Parameter({validation:ContextDataGuard}))
                .next(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

        });
    });

});


