import chai from "chai";
import { response } from "express";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080')

describe('Products endpoint tests', () => {
    describe('Get all products', () => {
        it('Get all', async() => {
            const response = await requester.get('/api/products')
            const body = response._body

            expect(body.status).to.equal('success')
            expect(body.payload).to.be.an.instanceof(Array)
        })
    })

    describe('Get Product by ID', () => {
        it('Use correct ID', async() => {
            const ID = "63e49e250bc2a55e29faf2e1"
            const response = await requester.get(`/api/products/${ID}`)
            const body = response._body

            expect(body._id).to.equal('63e49e250bc2a55e29faf2e1')
            expect(body).to.have.property('title')
        })

        it('Use non existing ID', async() => {
            const ID = "63e49e250bc2a55eeee29faf2e1"
            const response = await requester.get(`/api/products/${ID}`)
            const body = response._body

            expect(body.error).to.equal('NotFoundError')
        })
    })
})