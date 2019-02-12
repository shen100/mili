import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'usertrack'})
export class UserTrack {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 50 })
    platform: string;

    @Column('varchar', { length: 2000, nullable: true })
    url: string;

    @Column('varchar', { length: 2000, nullable: true })
    referrer: string;

    @Column('varchar', { name: 'client_id', length: 200 })
    clientID: string;

    @Column('int', { name: 'user_id', nullable: true })
    userID: number;

    @Column('varchar', { length: 100, nullable: true })
    ip: string;

    @Column('varchar', { length: 500, nullable: true })
    ua: string;

    @Column('int', { name: 'device_width', nullable: true })
    deviceWidth: number;

    @Column('int', { name: 'device_height', nullable: true })
    deviceHeight: number;

    @Column('varchar', { name: 'browser_name', length: 50, nullable: true })
    browserName: string;

    @Column('varchar', { name: 'browser_version', length: 50, nullable: true })
    browserVersion: string;

    @Column('varchar', { name: 'device_model', length: 50, nullable: true })
    deviceModel: string;

    @Column('varchar', { length: 50, nullable: true })
    country: string;

    @Column('varchar', { length: 50, nullable: true })
    language: string;

    @Column('varchar', { name: 'os_name', length: 50, nullable: true })
    osName: string;

    @Column('varchar', { name: 'os_version', length: 50, nullable: true })
    osVersion: string;

    @Column('datetime')
    date: Date;
}