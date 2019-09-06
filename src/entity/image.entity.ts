import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity({name: 'images3'})
// export class Image2 {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column('varchar', { length: 10 })
//     name: string;
// }

@Entity({name: 'images'})
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { name: 'width' })
    width: number;

    @Column('int', { name: 'height' })
    height: number;

    @Column('varchar', { name: 'url', length: 200 })
    url: string;

    @Column('varchar', { name: 'mime', length: 50 })
    mime: string;

    @Column('int', { name: 'size' })
    size: number; // 单位字节

    @Column('varchar', { name: 'format', length: 50 })
    format: string;
}