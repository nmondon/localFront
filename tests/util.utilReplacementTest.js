import {should, expect, assert} from 'chai'

import utilReplacement from '../src/util/utilReplacement.js'
import utilFilter from '../src/util/utilFilter.js'

describe('utilReplacement', () => {

    describe('findFilter', () => {

        it('should find http://a.f1g.fr/* for http://a.f1g.fr/assets-css/hp/01-fig-hp.css?d68e300a', () => {
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: "http://a.f1g.fr/*"
            })

            let url = 'http://a.f1g.fr/assets-css/hp/01-fig-hp.css?d68e300afdfcbd441e03df8f41ba90bb88bfff45'

            let foundFilter = utilReplacement.findFilter([filter], url)
            assert.isDefined(foundFilter)

        })

        it('should find http://a.f1g.fr/* for http://a.f1g.fr/assets-css', () => {
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: "http://a.f1g.fr/*"
            })

            let url = 'http://a.f1g.fr/assets-css'

            let foundFilter = utilReplacement.findFilter([filter], url)
            assert.isDefined(foundFilter)
        })

        it('should not find http://a.f1g.fr/*.js for http://a.f1g.fr/toto.css', () => {
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: "http://a.f1g.fr/*.js"
            })

            let url = 'http://a.f1g.fr/toto.css'

            assert.throw( () => {
                utilReplacement.findFilter([filter], url)
            }, Error)
        })

        it('should manage multiple * in glob patterns', ()=>{
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: "http://a.f1g.fr/*.js?*"
            })
            let url = 'http://a.f1g.fr/toto.js'

            let foundFilter = utilReplacement.findFilter([filter], url)
            assert.isDefined(foundFilter)
        })

        it('should manage multiple * in glob patterns #2', ()=>{
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: "http://a.f1g.fr/*.js?*"
            })
            let url = 'http://a.f1g.fr/toto.js?aetaze'

            let foundFilter = utilReplacement.findFilter([filter], url)
            assert.isDefined(foundFilter)
        })

        it('should manage multiple * in glob patterns #3', ()=>{
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: "http://a.f1g.fr/*.js?*"
            })
            let url = 'http://a.f1g.fr/toto.css?aetaze'

            assert.throw( () => {
                utilReplacement.findFilter([filter], url)
            }, Error)
        })

    })

    describe('replaceUrl', () => {

        it('should replace http://toto/test.js by http://tutu/test.js', () => {
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: 'http://toto/*',
                urlReplacement: 'http://tutu/*'
            })

            let url = 'http://toto/test.js'
            let replacedUrl = utilReplacement.replaceUrl(filter, url)
            assert.equal(replacedUrl, 'http://tutu/test.js')
        })

        it('should replace http://toto/test.js by http://tutu/test.js #2', () => {
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: 'http://toto/*.js',
                urlReplacement: 'http://tutu/*.js'
            })

            let url = 'http://toto/test.js'
            let replacedUrl = utilReplacement.replaceUrl(filter, url)

            assert.equal(replacedUrl, 'http://tutu/test.js')
        })

        it('should replace url and change names if specified', () => {
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: 'http://toto/*.js',
                urlReplacement: 'http://tutu/*.js',
                nameChanges: 'test=>test.min'
            })

            let url = 'http://toto/test.js'
            let replacedUrl = utilReplacement.replaceUrl(filter, url)

            assert.equal(replacedUrl, 'http://tutu/test.min.js')
        })

        it('should manage multiple *', () => {
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: 'http://a.f1g.fr/*.js?*',
                urlReplacement: 'http://tutu/*.js?*'
            })

            let url = 'http://a.f1g.fr/toto.js'
            let replacedUrl = utilReplacement.replaceUrl(filter, url)

            assert.equal(replacedUrl, 'http://tutu/toto.js')
        })

        it('should manage multiple * #2', () => {
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: 'http://a.f1g.fr/*.js?*',
                urlReplacement: 'http://tutu/*.js?*'
            })

            let url = 'http://a.f1g.fr/toto.js?afzaf=aef'
            let replacedUrl = utilReplacement.replaceUrl(filter, url)

            assert.equal(replacedUrl, 'http://tutu/toto.js?afzaf=aef')
        })

        it('should manage multiple * with change names', () => {
            let filter = Object.assign({}, utilFilter.createFilter(), {
                urlToReplace: 'http://a.f1g.fr/*.js?*',
                urlReplacement: 'http://tutu/*.js?*',
                nameChanges: 'toto=>toto.min'
            })

            let url = 'http://a.f1g.fr/toto.js?afzaf=aef'
            let replacedUrl = utilReplacement.replaceUrl(filter, url)

            assert.equal(replacedUrl, 'http://tutu/toto.min.js?afzaf=aef')
        })

    })

})