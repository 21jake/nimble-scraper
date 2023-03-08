import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/entities/user.entity';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const body = { ...req.body };
    const user = req.user as User;


    const userDetails = user ? `[USER]: (${user.username} - ${user.id})` : '[USER]: (Guest)';
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const requestDetails = `[REQUEST]: (${req.method} ${req.url})`;
    const requestBody = `[BODY]: ${JSON.stringify(body)}`;

    Logger.debug(
      `${userDetails} -- ${className}.${handlerName}() : ${requestDetails} : ${requestBody}`,
      this.constructor.name
    );

    return next.handle();
  }
}
