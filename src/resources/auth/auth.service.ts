import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { camelizeKeys } from 'fast-case';
import { getAuth, UserInfo, UserRecord } from 'firebase-admin/auth';
import { Db } from 'mongodb';
import * as qs from 'qs';
import {
  catchError,
  firstValueFrom,
  forkJoin,
  from,
  map,
  of,
  switchMap,
  throwError,
  zip
} from 'rxjs';
import { googleClientId, mongodbInjectionToken } from 'src/shared/constants';
import { Camelize } from 'src/shared/types/camelize';

export type GoogleTokens = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  id_token: string;
  scope: string;
  token_type: 'Bearer';
};

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private readonly http: HttpService,
    @Inject(mongodbInjectionToken)
    private db: Db
  ) {}

  async authUserByUid(uid: string): Promise<UserRecord> {
    return getAuth().getUser(uid);
  }

  async exchangeCodeForTokens(code: string) {
    let payload = {
      code,
      client_id: googleClientId,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    };

    let headers = {
      Host: 'oauth2.googleapis.com',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    // let response: AxiosResponse<GoogleTokens>;
    return firstValueFrom(
      this.http
        .post<GoogleTokens>(`https://oauth2.googleapis.com/token`, qs.stringify(payload), {
          headers
        })
        .pipe(
          map(({ data }) => camelizeKeys(data) as Camelize<GoogleTokens>),
          switchMap((data) => {
            const userInfoObservable = from(
              this.http.get<UserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${data.accessToken}` }
              })
            ).pipe(map((res) => res.data));
            return forkJoin({
              tokens: of(data),
              userInfo: userInfoObservable
            });
          }),
          catchError((err: AxiosError) => {
            let exception = new HttpException(
              `It was impossible to exchange authorization code=${code} with tokens`,
              err.response.status,
              { cause: err.response.data }
            );
            return throwError(() => exception);
          })
        )
        .pipe(
          switchMap(({ tokens, userInfo }) => {
            let { accessToken, refreshToken } = tokens;
            return zip(
              of(tokens),
              this.db.collection('auth').updateOne(
                { email: userInfo.email },
                {
                  $set: {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                  }
                },
                { upsert: true }
              )
            );
          }),
          map(([{ accessToken, idToken }]) => ({ accessToken, idToken }))
        )
    );
  }

  async refreshToken(email: string) {
    let tokens = await this.db.collection('auth').findOne({ email });

    if (!tokens) throw new NotFoundException(`Tokens not found for user with email=${email}`);

    let payload = {
      client_id: googleClientId,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: tokens.refreshToken
    };

    let headers = {
      Host: 'oauth2.googleapis.com',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    return firstValueFrom(
      this.http
        .post('https://oauth2.googleapis.com/token', qs.stringify(payload), { headers })
        .pipe(map(({ data }) => camelizeKeys(data) as Camelize<GoogleTokens>))
    );
  }
}
