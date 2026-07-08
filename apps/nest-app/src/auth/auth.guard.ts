import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ICurrentUser } from './current-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const dummyUser: ICurrentUser = {
      id: '257b955b-62ae-4f79-878e-1dbce39d23a9',
      name: 'test',
      email: 'test@gmail.com',
    };

    request['user'] = dummyUser;
    return true;
  }
}
