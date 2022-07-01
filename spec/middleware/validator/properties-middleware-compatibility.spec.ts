import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validator, {ValidatorParameter, ValidatorParameters} from '../../../dist/middleware/validator';
import Stop from '../../../dist/middleware/stop';
import OneGuard from './one-validator';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

let router =  BindToServer(server, new Router());

describe('guard', () => {

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .add(ValidatorParameters(OneGuard(), ['response', 'status'], Stop))
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
                .add(ValidatorParameters(OneGuard(), ['a', 'b'], Stop))
                .add(function (ctx) {

                    let number : number = ctx.a.b;
                    let one : 1 = ctx.a.b;
                    // @ts-expect-error
                    let two : 2 = ctx.a.b;
                    // @ts-expect-error
                    let string : string = ctx.a.b;

                    return ctx;
                });

            router
                .add(Validator.Parameters(OneGuard(), ['a', 'b'], Stop))
                .add(function (ctx) {

                    let number : number = ctx.a.b;
                    let one : 1 = ctx.a.b;
                    // @ts-expect-error
                    let two : 2 = ctx.a.b;
                    // @ts-expect-error
                    let string : string = ctx.a.b;

                    return ctx;
                });
        });

        describe('parameter', ()=>{

            router
                .add(ValidatorParameter({
                    validator: OneGuard(),
                    properties: ['a', 'b'],
                    invalid : Stop
                }))
                .add(function (ctx) {

                    let number : number = ctx.a.b;
                    let one : 1 = ctx.a.b;
                    // @ts-expect-error
                    let two : 2 = ctx.a.b;
                    // @ts-expect-error
                    let string : string = ctx.a.b;

                    return ctx;
                });

            router
                .add(Validator.Parameter({
                    validator: OneGuard(),
                    properties: ['response', 'body'],
                    invalid : Stop
                }))
                .add(function (ctx) {

                    let number : number = ctx.response.body;
                    let one : 1 = ctx.response.body;
                    // @ts-expect-error
                    let two : 2 = ctx.response.body;
                    // @ts-expect-error
                    let string : string = ctx.response.body;

                    return ctx;
                });
        });
    });
    describe('with context', ()=>{
        describe('parameters', ()=>{
            router
                .add(ValidatorParameters(OneGuard(), ['response', 'status'], Stop))
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
                .add(Validator.Parameters(OneGuard(), ['response', 'status'], Stop))
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
        describe('parameter', ()=>{
            router
                .add(ValidatorParameter({
                    validator: OneGuard(),
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
                .add(Validator.Parameter({
                    validator: OneGuard(),
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



