import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation';
import ContextDataGuard from './context-data-guard';
import Context from '../../../dist/context/context';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

let router =  BindToServer(server, new Router());

describe('validatable', ()=>{

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .add(ValidationParameters(() => true))
                .add(function (ctx) {

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
                .add(Validation.Parameters(() => true))
                .add(function (ctx) {

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
                .add(ValidationParameter({validation: ()=>true}))
                .add(function (ctx) {

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
                .add(Validation.Parameter({validation: ()=>true}))
                .add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(ValidationParameters(() => true))
                .add(function (ctx) {

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

                })
                .add(Validation.Parameters(() => true))
                .add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(ValidationParameter({validation: ()=>true}))
                .add(function (ctx) {

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

                })
                .add(Validation.Parameter({validation: ()=>true}))
                .add(function (ctx) {

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
                .add(ValidationParameters(ContextDataGuard))
                .add(function (ctx) {

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
                .add(Validation.Parameters(ContextDataGuard))
                .add(function (ctx) {

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
                .add(ValidationParameter({validation:ContextDataGuard}))
                .add(function (ctx) {

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
                .add(Validation.Parameter({validation:ContextDataGuard}))
                .add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(ValidationParameters(ContextDataGuard))
                .add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(Validation.Parameters(ContextDataGuard))
                .add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(ValidationParameter({validation:ContextDataGuard}))
                .add(function (ctx) {

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
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(Validation.Parameter({validation:ContextDataGuard}))
                .add(function (ctx) {

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


