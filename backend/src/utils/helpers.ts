import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import dayjs from 'dayjs';
import { extname } from 'path';
import { appEnv } from 'src/configs/config';

export const generateRandomString = (radix: number = 36): string => {
  // radix cant be less than 2 or greater than 36
  if (radix < 2 || radix > 36) {
    radix = 36;
  }

  return Math.random().toString(radix).slice(2);
};

export const csvMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: appEnv.CSV_PATH,
    filename: (req, file, cb) => {
      //Calling the callback passing the random name generated with the original extension name
      cb(null, `${dayjs().unix()}${extname(file.originalname)}`);
    },
  }),
};

// You might see this function got scattered around the codebase
// mostly to deal with puppeteer
export const sleep = (ms = 5_000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
