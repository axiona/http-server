import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Router from '../../../dist/router/standard.js';
import Context from '../../../dist/context/context.js';
import Replace, {ReplaceParameters} from '../../../dist/middleware/replace.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

let router =  BindToServer(server, new Router());

describe('empty', ()=>{

    router
        .add(ReplaceParameters((data: string) : string => 'data', ['data']))
        .add(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    router
        .add(Replace.Parameters((data: string) => 'data', ['data']))
        .add(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

});

describe('set', ()=>{

    router
        .add(function (context) {

            return Object.assign(context, {data: 'a' as string|number|boolean});

        })
        .add(ReplaceParameters((data: string|number|boolean) => 'data', ['data']))
        .add(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    router
        .add(function (context) {

            return Object.assign(context, {data: 'a' as string|number|boolean});

        })
        .add(Replace.Parameters((data: string|number|boolean) => 'data', ['data']))
        .add(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

});

describe('set diff', ()=>{

    router
        .add(function (context) {

            return Object.assign(context, {a: 'a' as string|number|boolean});

        })
        // @ts-expect-error
        .add(ReplaceParameters((data: string|number|boolean) => 'data', ['data']))
        .add(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    router
        .add(function (context) {

            return Object.assign(context, {a: 'a' as string|number|boolean});

        })
        // @ts-expect-error
        .add(Replace.Parameters((data: string|number|boolean) => 'data', ['data']))
        .add(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

});
