import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import {ValidatorParameter} from '../../../dist/middleware/validator';
import Stop from '../../../dist/middleware/stop';
import RecordValidator, {ValidatorType} from './record-validator';
import ContextValidator from './context-validator';
import Validatable from '../../../../validator/dist/validatable/validatable';
import {ValidatorParameters} from '../../../dist/middleware/validator';

it("force console log", () => { spyOn(console, 'log').and.callThrough();});

let called : boolean = false;

const server = Server();

let router =  BindToServer(server, new Router());

describe('parameters', () => {

    describe('properties', () => {

        it('validatable', ()=>{

            router
                .add(ValidatorParameters(RecordValidator(), ['request', 'body'], undefined, undefined, ['bodyValid']))
                .add(function (ctx) {

                // @ts-expect-error
                const boolean : boolean = ctx.request.body;
                // @ts-expect-error
                const string : string = ctx.request.body;
                // @ts-expect-error
                const number : number = ctx.request.body;

                // @ts-expect-error
                const validatable : Validatable = ctx.validatable;

                const bodyValid : Validatable = ctx.bodyValid;

                const object : object = ctx.request.body;
                const type : ValidatorType = ctx.request.body;
                const record : Record<PropertyKey, any> = ctx.request.body;
                ctx.response.body = record;
                called = true;
                return ctx;
            });

        });

    });


    describe('context', () => {

        it('validatable', ()=>{

            router.add(ValidatorParameters(ContextValidator, undefined, undefined, undefined, ['bodyValid']))
                .add(function (ctx) {

                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const record : Record<PropertyKey, any> = ctx.request.body;

                    // @ts-expect-error
                    const validatable : Validatable = ctx.validatable;

                    const bodyValid : Validatable = ctx.bodyValid;

                    const string : string = ctx.data;
                    ctx.response.body = record;
                    called = true;
                    return ctx;
                });

        });

    });
});

describe('parameter', () => {

    describe('properties', () => {

        it('validation', ()=>{

            router.add(ValidatorParameter({
                validator: RecordValidator(),
                invalid: Stop,
                replace: true,
                properties: ['request', 'body'],
                validatable : ['bodyValid']
            })).add(function (ctx) {

                // @ts-expect-error
                const boolean : boolean = ctx.request.body;
                // @ts-expect-error
                const string : string = ctx.request.body;
                // @ts-expect-error
                const number : number = ctx.request.body;

                // @ts-expect-error
                const validatable : Validatable = ctx.validatable;

                const bodyValid : Validatable = ctx.bodyValid;

                const object : object = ctx.request.body;
                const type : ValidatorType = ctx.request.body;
                const record : Record<PropertyKey, any> = ctx.request.body;
                ctx.response.body = record;
                called = true;
                return ctx;
            });

        });

    });


    describe('context', () => {


        it('validation', ()=>{

            router.add(ValidatorParameter({
                validator: ContextValidator,
                validatable : ['bodyValid']
            })).add(function (ctx) {

                // @ts-expect-error
                const boolean : boolean = ctx.data;
                // @ts-expect-error
                const object : object = ctx.data;
                // @ts-expect-error
                const number : number = ctx.data;
                // @ts-expect-error
                const record : Record<PropertyKey, any> = ctx.request.body;

                // @ts-expect-error
                const validatable : Validatable = ctx.validatable;

                const bodyValid : Validatable = ctx.bodyValid;

                const string : string = ctx.data;
                ctx.response.body = record;
                called = true;
                return ctx;
            });

        });

    });
});
