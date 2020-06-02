import { IUserDocument } from "../../interfaces/UserInterface";
import { User } from "../../models";
import userService from "../../services/userService";

export default () => {
    describe("User services", () => {
        // after(async () => {
        //     const users = await User.find({});
        //     users.map(user => user.remove());
        // });

        const newUserData = {
            firstName: "Gleb",
            secondName: "Kasyak",
            email: "sonyck94@mail.com",
            password: "12345"
        } as IUserDocument;

        describe("REGISTER", async () => {
            it("it should user data", async () => {
              const newUser = await userService.register(newUserData.email, newUserData.password, newUserData);
              const createdUser = await User.findOne({ email: newUserData.email });

              newUser.email.should.eql(createdUser?.email);
              newUser._id.should.eql(createdUser?._id);
            });
        });

        describe("LOGIN", async () => {
            it("it should return token string", async () => {
                const token = await userService.login(newUserData.email, newUserData.password);

                token.should.be.a("string");
            });
        });

        describe("REMOVE", async () => {
            it("it should removed user", async () => {
                const user = await User.findOne({ email: newUserData.email });
                await userService.removeUser(user?._id);

                const removedUser = await User.findById(user?._id);
                removedUser?.should.eql(null);
            });
        });
    });
};