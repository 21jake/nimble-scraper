import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { appEnv } from './config';


const AppDataSource =  new DataSource({
    type: "postgres",
    database: appEnv.DATABASE_NAME,
    host: appEnv.DATABASE_HOST,
    username: appEnv.DATABASE_USER,
    password: appEnv.DATABASE_PASSWORD,
    port: appEnv.DATABASE_PORT,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: false,
    migrations: [__dirname + '/../database/migrations/*.{js,ts}'],
    migrationsRun: true,
    logging: true
})

export default AppDataSource;


