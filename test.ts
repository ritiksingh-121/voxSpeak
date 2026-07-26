// 1. Interfaces enforce the structural "shape" of an object
interface UserProfile {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  role?: string; // The '?' makes this property optional
}

// 2. Class implementation utilizing the interface structure
class UserManager {
  // Explicitly typing the class array property
  private users: UserProfile[] = [];

  // Method with typed parameters and a typed return value
  public addUser(user: UserProfile): string {
    this.users.push(user);
    return `Success: User ${user.username} has been added.`;
  }

  // Method returning a specific user profile or undefined
  public findUserById(id: number): UserProfile | undefined {
    return this.users.find((user) => user.id === id);
  }

  // Method with a 'void' return type because it returns nothing
  public logActiveUsers(): void {
    const activeUsers = this.users.filter((user) => user.isActive);
    console.log("Active Users:", activeUsers);
  }
}

// 3. Executing and testing the TypeScript code
const manager = new UserManager();

const newUser: UserProfile = {
  id: 101,
  username: "DevCoder",
  email: "dev@example.com",
  isActive: true,
};

console.log(manager.addUser(newUser));
manager.logActiveUsers();


//add comment properly