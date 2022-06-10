import Koa from 'koa';
import Router from './router/router';
import Context from './context/context';

export default function Register(koa : Koa, router: Router) : Router {

    koa.use(async function (context, next) {

       const result = await router.call(
            Object.assign(context, {router}) as Context
        );

       if(result) {

           return next();
       }

    });

    return router;

}
