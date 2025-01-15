import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { CBaseEntities } from "./CBase.entities";

@Entity('users')  // This maps to the 'users' table in the database
export class UserEntities extends CBaseEntities {
    @PrimaryGeneratedColumn()
    userId: number;


    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ default: 'shop_owner' })
    role: string; // admin
    vendors: any;
    // id: any;
}











// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

// @Entity('users')
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   username: string;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   password: string;

//   @Column({ default: 'shop_owner' })
//   role: string; // 'admin' or 'shop_owner'

// //   @OneToMany(() => Shop, shop => shop.owner)
// //   shops: Shop[];
// }
