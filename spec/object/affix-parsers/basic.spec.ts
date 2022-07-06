import BracesParsers from '../../../dist/object/affix-parsers.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('single', function () {

    it('single', function () {

        const result = BracesParsers()([
            ['root1', 'data 1'],
            ['root2', 'data 2'],
        ]);

        expect(result).toEqual({
            root1: 'data 1',
            root2: 'data 2',
        });
    });

});

describe('multi', function () {

    it('object', function () {

        const result = BracesParsers()([
            ['root[parent][child1]', 'data 1'],
            ['root[parent][child2]', 'data 2'],
        ]);

        expect(result).toEqual(
            {
                root: {
                    parent: {
                        child1: 'data 1',
                        child2: 'data 2',
                    }
                }
            }
        );

    });

    it('object with array', function () {

        const result = BracesParsers()([
            ['root[parent][child][]', 'data 1'],
            ['root[parent][child][]', 'data 2'],
        ]);

        expect(result).toEqual(
            {
                root: {
                    parent: {
                        child: [
                            'data 1',
                            'data 2'
                        ]
                    }
                }
            }
        );

    });

    it('object with array in middle', function () {

        const result = BracesParsers()([
            ['root[parent][][child]', 'data 1'],
            ['root[parent][][child]', 'data 2'],
        ]);

        expect(result).toEqual(
            {
                root: {
                    parent: [
                        { child: 'data 1' },
                        { child: 'data 2' },
                    ]
                }
            }
        );

    });

});


describe('invalid', function () {

    it('invalid 1', function () {

        const result = BracesParsers()([['root[par[ent][child]', 'data']]);

        expect(result).toEqual(
            {
                root : {
                    par: {
                        ent: {
                            child: 'data'
                        }
                    }
                }
            }
        );
    });

    it('invalid 2', function () {

        const result = BracesParsers()([['root[parent][chi]ld]', 'data']]);

        expect(result).toEqual(
            {
                root : {
                    parent: {
                        chi: {
                            ld: 'data'
                        }
                    }
                }
            }
        );
    });

});
