import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080')

describe('Carts endpoint tests', () => {
    describe('Get all products from given cart', () => {
        it('Use correct ID', async() => {
            const ID = "63efa3bfbd0a7eb84521ab1d"
            const response = await requester.get(`/api/carts/${ID}`)
            const body = response._body

            expect(body).to.be.an.instanceof(Array)
        })

        it('Use non existing ID', async() => {
            const ID = "63efa3bfbd0a7eb8452e1ab1d"
            const response = await requester.get(`/api/carts/${ID}`)
            const body = response._body

            expect(body.status).to.equal('NotFoundError')
            expect(response.status).to.equal(404)
        })
    })

    describe('Create cart', () => {
        it('Create cart successful', async() => {
            const response = await requester.post('/api/carts')
            const body = response._body

            expect(body.products).to.be.an.instanceof(Array)
            expect(body.products.length).to.be.equal(0)
            expect(body).to.have.property('_id')
        })
    })
})