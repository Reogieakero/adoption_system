export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public extra?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}
