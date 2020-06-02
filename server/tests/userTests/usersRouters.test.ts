import { Application } from "express";
import path from "path";
import fs from "fs";

import { User } from "../../models";

export default (app: Application, chai: Chai.ChaiStatic) => {
    describe("User routers", () => {
        let token = "";

        const userData = {
            firstName: "Gleb",
            secondName: "Kasyak",
            email: "sonyck94@mail.com",
            password: "12345"
        } as const;

        describe("/POST register", async () => {
            it("it should be success user register", async () => {
                const user = await chai.request(app)
                    .post("/api/users/")
                    .send(userData);

                user.should.have.status(201);
                user.body.should.be.an("object");
                user.body.should.have.property("message").eql("User is created");
                user.body.data.should.have.property("firstName");
                user.body.data.should.have.property("secondName");
                user.body.data.should.have.property("email").eql(userData.email);
                user.body.data.should.have.property("password");
            });
        });

        describe("/POST login", async () => {
            it("it should get token", async () => {
                const login = await chai.request(app)
                    .post("/api/users/login")
                    .send({
                        email: userData.email,
                        password: userData.password
                    });

                login.should.have.status(200);
                login.body.should.be.an("object");
                login.body.should.have.property("message").eql("Token is created");
                login.body.data.should.be.a("string");

                token = login.body.data;
            });
        });

        describe("/GET me", async () => {
            it("authorization  should be success", async () => {

                const me = await chai.request(app)
                    .get("/api/users/")
                    .set({ "Authorization": `Bearer ${ token }` });

                me.should.have.status(200);
                me.body.should.have.property("message").eql("You are authenticated");
                me.body.data.should.have.property("email").eql(userData.email);
                me.body.data.should.not.have.property("password");
            });
        });

        describe("/POST avatar", async () => {
            it("avatar should be uploaded", async () => {

                const avatar = await chai.request(app)
                    .post("/api/users/upload-avatar")
                    .set({ "Authorization": `Bearer ${ token }` })
                    .set("Content-Type", "multipart/form-data")
                    .attach("avatar",
                        fs.readFileSync(
                            path.resolve(__dirname, "../../uploads/default/default_avatar.png")),
                        "default_avatar.png"
                    );

                const userAvatar = await User.findOne({ email: userData.email }, { avatar: 1, _id: 0 });

                avatar.should.have.status(200);
                avatar.body.should.have.property("message").eql("User avatar is uploaded");
                avatar.body.data.should.be.a("string").eql(userAvatar?.avatar)
            });
        });

        describe("/POST new data", async () => {
            it("user should be update", async () => {
                const user = await chai.request(app)
                    .post("/api/users/new-user-data")
                    .set({ "Authorization": `Bearer ${ token }` })
                    .set({ firstName: "Test1", secondName: "Test22" });

                const updatedData = await User.findOne(
                    { email: userData.email },
                    { firstName: 1, secondName: 1, _id: 0 });

                user.should.have.status(200);
                user.body.should.have.property("message").eql("New user info");
                user.body.data.should.have.property("firstName").eql(updatedData?.firstName);
                user.body.data.should.have.property("secondName").eql(updatedData?.secondName);
            });
        });

        describe("/GET logout", async () => {
            it("logout should be success", async () => {
                const login = await chai.request(app)
                    .get("/api/users/logout")
                    .set({ "Authorization": `Bearer ${ token }` });

                login.should.have.status(200);
                login.body.should.have.property("message").eql("You are logout");
            });
        });

        describe("/DELETE user", async () => {
            it("user should be deleted", async () => {
                const user = await chai.request(app)
                    .delete("/api/users/")
                    .set({ "Authorization": `Bearer ${ token }` });

                user.should.have.status(200);
                user.body.should.have.property("message").eql("Account is deleted");
            });
        });
    });
};