import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validation, {ValidationParameter, ValidationParameters} from '../../../dist/middleware/validation';
import Stop from '../../../dist/middleware/stop';
import Number from '@alirya/number/boolean/number';
import String from '../../../../string/dist/boolean/string';
import NumberValidatable from './number-validatable';
import ContextValidatable from './context-validatable';
import {O} from 'ts-toolbelt';
import Context from '../../../dist/context/context';

it("force console log", () => { spyOn(console, 'log').and.callThrough();});


const server = Server();

beforeAll(()=>server.open());
afterAll(()=>server.close());

let router =  BindToServer(server, new Router());

describe('properties', () => {

    describe('validation', () => {

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

    describe('guard', () => {

        it('parameters', ()=>{

            router
                .add(ValidationParameters(NumberValidatable, ['response', 'status'], undefined))
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
                .add(Validation.Parameters(NumberValidatable, ['response', 'status'], undefined))
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
                .add(ValidationParameter({validation: NumberValidatable, properties: ['response', 'status'], invalid: undefined}))
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
                .add(Validation.Parameter({validation: NumberValidatable, properties: ['response', 'status'], invalid: undefined}))
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

describe('properties middleware', () => {

    describe('validation', () => {

        it('parameters', ()=>{

            router
                .add(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .add(ValidationParameters(() => true, ['request', 'body'], Stop))
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
                .add(Validation.Parameters(() => true, ['request', 'body'], Stop))
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
                .add(ValidationParameter({
                validation: () => true,
                properties : ['request', 'body'],
                invalid : Stop
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
                    invalid : Stop
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

    describe('guard', () => {

        it('parameters', ()=>{

            router
                .add(ValidationParameters(NumberValidatable, ['response', 'status'], Stop))
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
                .add(Validation.Parameters(NumberValidatable, ['response', 'status'], Stop))
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
                    validation: NumberValidatable,
                    properties: ['response', 'status'],
                    invalid : Stop
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
                    validation: NumberValidatable,
                    properties: ['response', 'status'],
                    invalid : Stop
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

describe('context', () => {

    let called : boolean = false;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());

    describe('validatable', ()=>{
        it('parameters', ()=>{

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

        it('parameter', ()=>{

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

    it('guard', ()=>{
        it('parameters', ()=>{

            router
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(ValidationParameters(ContextValidatable))
                .add(function (ctx) {

                    let string : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;

                    return ctx;
                });

            router
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(Validation.Parameters(ContextValidatable))
                .add(function (ctx) {

                    let string : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;

                    return ctx;
                });

        });

        it('parameter', ()=>{

            router
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(ValidationParameter({validation:ContextValidatable}))
                .add(function (ctx) {

                    let string : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;

                    return ctx;
                });

            router
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(Validation.Parameter({validation:ContextValidatable}))
                .add(function (ctx) {

                    let string : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;

                    return ctx;
                });

        });
    });

});

