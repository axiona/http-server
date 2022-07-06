import Router from './router.js';

export default function Root(router : Router) : Router {

    while (router.parent) {

        router = router.parent;
    }

    return router;

}