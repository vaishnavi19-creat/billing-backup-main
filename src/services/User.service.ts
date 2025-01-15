import { getRepository } from "typeorm";
import { CLoginEntities } from "../db/entities/CLogin.entities";
import { UserModel } from "../db/models/User.model";
import { IUser } from "../interfaces/User.interface";

export class UserService {
  private userModel = new UserModel();

  async registerUser(data: IUser) {
    const existingUser = await this.userModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    return await this.userModel.createUser(data);
  }

  async getUserByEmail(email: string) {
    return this.userModel.findByEmail(email);
  }



   // Method to get a user by ID
  async getUserById(userId: number) {
    const userRepository = getRepository(CLoginEntities);
    
    const user = await userRepository.findOne({ where: { userId: userId.toString() } });

    if (!user) {
        throw new Error('User not found'); 
    }

    return user; 
}


  async filterUser(filters: { username?: string; email?: string; role?: string }) {
    const userRepository = getRepository(CLoginEntities);

    const query = userRepository.createQueryBuilder("user");

    if (filters.username) {
      query.andWhere("user.username = :username", { username: filters.username });
    }

    if (filters.email) {
      query.andWhere("user.email = :email", { email: filters.email });
    }

    if (filters.role) {
      query.andWhere("user.role = :role", { role: filters.role });
    }

    // Execute the query and return the result
    const users = await query.getMany();
    return users.length ? users : null;
  }



  // Method to get all users
  async getAllUsers() {
    const userRepository = getRepository(CLoginEntities);
    const users = await userRepository.find();

    if (users.length === 0) {
        throw new Error('No users found'); 
    }

    return users; 
}




  // New Method: Update user (PUT)
  async updateUser(id: number, data: Partial<IUser>) {
    const userRepository = getRepository(CLoginEntities);
    await userRepository.update(id, data);
    const user = await userRepository.findOne({ where: { userId: id.toString() } });
    if (!user) {
      throw new Error('User not found');
  }
  return user;
    


  }


   // New Method: Patch user 
  async patchUser(id: number, data: { email?: string; mobileNumber?: string }) {
  const userRepository = getRepository(CLoginEntities);

  // Check if the user exists before updating
  const user = await userRepository.findOne({ where: { userId: id.toString() } });
  if (!user) {
      throw new Error('User not found');
  }

  if (data.email) {
      user.email = data.email;
  }

  await userRepository.save(user);
  return user; 
}



   // Method to delete a user by ID
   async deleteUser(id: number) {
    const userRepository = getRepository(CLoginEntities);
    const user = await userRepository.findOne({ where: { userId: id.toString() } });
    if (!user) {
      throw new Error('User not found');
    }
    await userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

}



