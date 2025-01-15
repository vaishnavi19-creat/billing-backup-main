import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,} from 'typeorm';

@Entity('invoices')
export class InvoiceEntities {
    @PrimaryGeneratedColumn()
    invoiceId: number;

    @Column({ unique: true })
    invoiceNumber: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column()
    paymentMode: string;

    @CreateDateColumn()
    invoiceDate: Date;

    
    3// Discount amount
    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    discount?: number;


    // Adding a discount type field (Direct or Percentage)
    @Column({ type: 'enum', enum: ['Direct', 'Percentage'], nullable: true })
    discountType?: 'Direct' | 'Percentage';

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    taxAmount?: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ default: 'Pending' })
    status: string;

    @Column({ nullable: true })
    dueDate?: Date;

    @Column()
    shopId: number;

    @Column()
    customerId: number;

    @CreateDateColumn()
    createdOn: Date;

    @UpdateDateColumn()
    updatedOn?: Date;
}











