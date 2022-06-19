import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import ContextValidator from './context-validator';
import Validator, {ValidatorParameter, ValidatorParameters} from '../../../dist/middleware/validator';
import Validatable from '../../../../validator/dist/validatable/validatable';

it("force console log", () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

let router =  BindToServer(server, new Router());

describe('context compatibility', ()=>{

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .add(ValidatorParameters(ContextValidator))
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


            router.add(ValidatorParameters(ContextValidator))
                .add(function (ctx) {

                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const record : Record<PropertyKey, any> = ctx.request.body;

                    const validatable : Validatable = ctx.validatable;

                    const string : string = ctx.data;
                    ctx.response.body = record;
                    return ctx;
                });

            router
                .add(Validator.Parameters(ContextValidator))
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
                .add(ValidatorParameter({validator:ContextValidator}))
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
                .add(Validator.Parameter({validator:ContextValidator}))
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
                .add(ValidatorParameters(ContextValidator))
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
                .add(Validator.Parameters(ContextValidator))
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
                .add(ValidatorParameter({validator:ContextValidator}))
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

            router.add(ValidatorParameter({
                validator: ContextValidator
            })).add(function (ctx) {

                // @ts-expect-error
                const boolean : boolean = ctx.data;
                // @ts-expect-error
                const object : object = ctx.data;
                // @ts-expect-error
                const number : number = ctx.data;
                // @ts-expect-error
                const record : Record<PropertyKey, any> = ctx.request.body;

                const validatable : Validatable = ctx.validatable;

                const string : string = ctx.data;
                ctx.response.body = record;
                return ctx;
            });

            router
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(Validator.Parameter({validator:ContextValidator}))
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


