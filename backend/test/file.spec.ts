// import { INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import * as path from 'path';
// import { AppModule } from 'src/app.module';
// import { appEnv } from 'src/configs/config';
// import { User } from 'src/entities/user.entity';
// import { generateRandomString } from 'src/utils/helpers';

// import request from 'supertest';

// describe('File', () => {
//   let app: INestApplication;
//   let token: string;
//   let randomUsername: string;
//   let randomPassword: string;

//   beforeAll(async () => {
//     const modRef = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = modRef.createNestApplication();
//     await app.init();

//     randomUsername = generateRandomString(32);
//     randomPassword = generateRandomString(32);

//     const signupReq = await request(app.getHttpServer())
//       .post('/api/signup')
//       .send({ username: randomUsername, password: randomPassword, confirmPassword: randomPassword });

//     token = signupReq.body.token;
//   });


//   it('Authenticated user should be able to upload file', async () => {
//     const file1Name = 'sample-1.csv';
//     const file1Path = path.join(appEnv.SAMPLE_TEST_FILE_PATH, file1Name);

//     await request(app.getHttpServer())
//       .post('/api/file')
//       //   .set('Authorization', `Bearer ${token}`)
//       .attach('file', path.join(file1Path))
//       .expect(401);

//     await request(app.getHttpServer())
//       .post('/api/file')
//       .set('Authorization', `Bearer ${token}`)
//       .attach('file', path.join(file1Path))
//       .expect((res) => {
//         expect(res.status).toBe(201);
//         expect(res.body).toHaveProperty('id');
//         expect(res.body.fileName).toBe(file1Name);
//         expect(res.body.uploader.username).toBe(randomUsername);

//       });

//     // const { id, filename, mimetype, size } = file.body;
//     // expect(id).toBeDefined();
//     // expect(filename).toBe('test.png');
//     // expect(mimetype).toBe('image/png');
//     // expect(size).toBe(120);
//   });

// //   it('Should be able to get a valid jwt when signing up', async () => {
// //     const signupReq = await request(app.getHttpServer())
// //       .post('/api/signup')
// //       .send({ username: randomUsername, password: randomPassword, confirmPassword: randomPassword })
// //       .expect((res) => {
// //         expect(res.status).toBe(201);
// //         expect(res.body).toHaveProperty('token');
// //         expect(res.body).toHaveProperty('id');
// //         expect(res.body.username).toBe(randomUsername);
// //       });

// //     const { token, id, username } = signupReq.body;
// //     await request(app.getHttpServer())
// //       .get('/api/profile')
// //       .set('Authorization', `Bearer ${token}`)
// //       .expect(200)
// //       .expect({ username, id });

// //     return await request(app.getHttpServer()).get('/api/profile').expect(401);
// //   });

// //   it('Should be able to loggin with an account', async () => {
// //     await request(app.getHttpServer())
// //       .post('/api/signup')
// //       .send({ username: randomUsername, password: randomPassword, confirmPassword: randomPassword });

// //     return await request(app.getHttpServer())
// //       .post('/api/login')
// //       .send({ username: randomUsername, password: randomPassword })
// //       .expect((res) => {
// //         expect(res.status).toBe(201);
// //         expect(res.body).toHaveProperty('token');
// //       });
// //   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
