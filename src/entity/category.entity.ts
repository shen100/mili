import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    TreeParent,
    Tree,
    TreeChildren,
} from 'typeorm';

@Entity({name: 'categories'})
@Tree('closure-table')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('datetime', { name: 'deleted_at', nullable: true, default: null })
    deletedAt: Date;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('int')
    sequence: number;

    @Column('int', { name: 'parent_id' })
    parentID: number;

    @TreeParent()
    parent: Category;

    @TreeChildren()
    children: Category[];
}