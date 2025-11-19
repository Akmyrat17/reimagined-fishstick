
import { UsersEntity } from "../../modules/users/entities/user.entity";
import { RolesEnum } from "../../common/enums";
import * as bcrypt from 'bcrypt';
import { seederDataSource } from "../../config/seeder.typeorm";

async function seed() {
    const connection = await seederDataSource.initialize();
    const userRepository = connection.getRepository(UsersEntity);
    const user = new UsersEntity();
    user.fullname = "adminfullname";
    user.password = await bcrypt.hash("admin", 10);
    user.email = "admin@gmail.com"
    user.role = RolesEnum.ADMIN;
    await userRepository.save(user);
}

seed();
