export interface IGetManyResp<T> {
    results: T[];
    count: number;
  }
  
  export class RespWrapper<T> implements IGetManyResp<T> {
    count: number;
    results: T[];
    constructor(results: T[], count: number) {
      this.count = count;
      this.results = results;
    }
  }