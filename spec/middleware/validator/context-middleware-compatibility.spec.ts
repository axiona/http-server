import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Validator, {ValidatorParameter, ValidatorParameters} from '../../../dist/middleware/validator.js';
import Stop from '../../../dist/middleware/stop.js';
import Context from '../../../dist/context/context.js';
import ContextValidator, {ContextValidatorFunction} from './context-validator.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

const router =  BindToServer(server, Router());

describe('guard', () => {

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidatorParameters(ContextValidator, undefined, Stop()))
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
                .next(Validator.Parameters(ContextValidator, undefined, Stop()))
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
                .next(ValidatorParameter({
                    validator: ContextValidator,
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
                .next(Validator.Parameter({
                    validator: ContextValidator,
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
                .next(ValidatorParameters(ContextValidator, undefined, Stop()))
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
                .next(ValidatorParameters(ContextValidatorFunction(), undefined, Stop()))
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
                .next(ValidatorParameter({
                    validator: ContextValidator,
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
                .next(Validator.Parameter({
                    validator: ContextValidatorFunction(),
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



