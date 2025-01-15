import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/User.service";

const userService = new UserService();

export class UserController{

static registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await userService.registerUser({ username, email, password, role });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

static getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};



    // Method to get a user by ID
static getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { id } = req.params;
      const userId = parseInt(id, 10); 
      const user = await userService.getUserById(userId);
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
          return res.status(200).json(user);
      } catch (error) {
          return res.status(400).json({ message: error.message });
      }
  };



static filterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.query.username ? (req.query.username as string) : undefined;
    const email = req.query.email ? (req.query.email as string) : undefined;
    const role = req.query.role ? (req.query.role as string) : undefined;

    const filters: { username?: string; email?: string; role?: string } = {
      username,
      email,
      role,
    };

    // Call the service method with filters
    const user = await userService.filterUser(filters);

    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'An error occurred while filtering the user' });
  }

};



  // New Method: Get all users
  static getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // New Method: Update user (PUT)
  static updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedUser = await userService.updateUser(Number(id), data);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // New Method: Patch user (Update specific fields)
  static patchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { email, mobileNumber } = req.body;
      const updatedUser = await userService.patchUser(Number(id), { email, mobileNumber });
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  // New Method: Delete user
  static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };



}





















// import { Request, Response, NextFunction } from "express";
// import { UserService } from "../services/User.service";

// const userService = new UserService();

// export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { username, email, password, role } = req.body;
//     const user = await userService.registerUser({ username, email, password, role });
//     return res.status(201).json(user);
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };

// export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email } = req.params;
//     const user = await userService.getUserByEmail(email);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     return res.status(200).json(user);
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };
