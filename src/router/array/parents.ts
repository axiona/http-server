import Router from '../router.js';

export default function Parents(router : Router) : Router[] {

    const routers : Router[] = [];

    while (router.parent) {

        routers.unshift(router.parent);

        router = router.parent;
    }

    return routers;

}