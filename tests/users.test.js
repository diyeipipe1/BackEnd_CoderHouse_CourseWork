import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest('http://localhost:8080')

describe('Users endpoint tests', () => {
    describe('Change normal to premium user', () => {
        it('Change user', async() => {
            const ID = "6406c49d6beae46692720d4f"
            const response = await requester.get(`/api/session/premium/${ID}`)
            const body = response._body

            expect(body.status).to.equal('success')
            expect(body.payload).to.have.property('role')
        }).timeout(5000)
    })

    describe('Login', () => {
        it('Login ok', async() => {
            const user = {
                email:"a",
                password:"a"
            }
            const response = await requester.post(`/api/session/login`).send(user)
            const body = response._body

            expect(body.status).to.equal('success')
        })

        it('Login failed', async() => {
            const user = {
                email:"a",
                password:"b"
            }
            const response = await requester.post(`/api/session/login`).send(user)
            const body = response._body

            expect(body.error).to.equal('email or password invalid')
        })
    })
})