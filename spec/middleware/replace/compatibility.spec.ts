import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Router from '../../../dist/router/middleware.js';
import Context from '../../../dist/context/context.js';
import Replace, {ReplaceParameters} from '../../../dist/middleware/replace.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

const router =  BindToServer(server, Router());

describe('empty', ()=>{

    router
        .next(ReplaceParameters((data: string|undefined) : string => 'data', ['data']))
        .next(function (ctx) {

            {
                const string: string = ctx.data;
                const data: Context = ctx;
                // @ts-expect-error
                const number: number = ctx.data;
                // @ts-expect-error
                const boolean: boolean = ctx.data;
                // @ts-expect-error
                const object: object = ctx.data;
            }

            {
                const string: Context & { data: string } = ctx;
                const data: Context = ctx;
                // @ts-expect-error
                const number: Context & { data: number } = ctx;
                // @ts-expect-error
                const boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                const object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    router
        .next(Replace.Parameters((data: unknown|string) => 'data', ['data']))
        .next(function (ctx) {

            {
                const string: string = ctx.data;
                const data: Context = ctx;
                // @ts-expect-error
                const number: number = ctx.data;
                // @ts-expect-error
                const boolean: boolean = ctx.data;
                // @ts-expect-error
                const object: object = ctx.data;
            }

            {
                const string: Context & { data: string } = ctx;
                const data: Context = ctx;
                // @ts-expect-error
                const number: Context & { data: number } = ctx;
                // @ts-expect-error
                const boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                const object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    it('',()=>expect(true).toBeTrue());
});

describe('set', ()=>{

    router
        .next(function (context) {

            return Object.assign(context, {data: 'a' as string|number|boolean});

        })
        .next(ReplaceParameters((data: string|number|boolean) => 'data', ['data']))
        .next(function (ctx) {

            {
                const string: string = ctx.data;
                const data: Context = ctx;
                // @ts-expect-error
                const number: number = ctx.data;
                // @ts-expect-error
                const boolean: boolean = ctx.data;
                // @ts-expect-error
                const object: object = ctx.data;
            }

            {
                const string: Context & { data: string } = ctx;
                const data: Context = ctx;
                // @ts-expect-error
                const number: Context & { data: number } = ctx;
                // @ts-expect-error
                const boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                const object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    router
        .next(function (context) {

            return Object.assign(context, {data: 'a' as string|number|boolean});

        })
        .next(Replace.Parameters((data: string|number|boolean) => 'data', ['data']))
        .next(function (ctx) {

            {
                const string: string = ctx.data;
                const data: Context = ctx;
                // @ts-expect-error
                const number: number = ctx.data;
                // @ts-expect-error
                const boolean: boolean = ctx.data;
                // @ts-expect-error
                const object: object = ctx.data;
            }

            {
                const string: Context & { data: string } = ctx;
                const data: Context = ctx;
                // @ts-expect-error
                const number: Context & { data: number } = ctx;
                // @ts-expect-error
                const boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                const object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    it('',()=>expect(true).toBeTrue());
});

describe('set diff', ()=>{

    router
        .next(function (context) {

            return Object.assign(context, {a: 'a' as string|number|boolean});

        })
        // @ts-expect-error
        .next(ReplaceParameters((data: string|number|boolean) => 'data', ['data']))
        .next(function (ctx) {

            {
                const string: string = ctx.data;
                const data: Context = ctx;
                // @ts-expect-error
                const number: number = ctx.data;
                // @ts-expect-error
                const boolean: boolean = ctx.data;
                // @ts-expect-error
                const object: object = ctx.data;
            }

            {
                const string: Context & { data: string } = ctx;
                const data: Context = ctx;
                // @ts-expect-error
                const number: Context & { data: number } = ctx;
                // @ts-expect-error
                const boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                const object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    router
        .next(function (context) {

            return Object.assign(context, {a: 'a' as string|number|boolean});

        })
        // @ts-expect-error
        .next(Replace.Parameters((data: string|number|boolean) => 'data', ['data']))
        .next(function (ctx) {

            {
                const string: string = ctx.data;
                const data: Context = ctx;
                // @ts-expect-error
                const number: number = ctx.data;
                // @ts-expect-error
                const boolean: boolean = ctx.data;
                // @ts-expect-error
                const object: object = ctx.data;
            }

            {
                const string: Context & { data: string } = ctx;
                const data: Context = ctx;
                // @ts-expect-error
                const number: Context & { data: number } = ctx;
                // @ts-expect-error
                const boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                const object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    it('',()=>expect(true).toBeTrue());
});
