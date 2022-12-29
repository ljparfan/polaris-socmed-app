export class DecodedAccessToken {
  private readonly ONE_MINUTE_IN_MS = 60000;

  constructor(public userId: number, private exp: number) {}

  public get expiredOrWillExpireSoon(): boolean {
    const currentDate = new Date();
    const expiry = this.exp * 1000;
    const now = currentDate.getTime();

    return expiry - now <= this.ONE_MINUTE_IN_MS;
  }
}
