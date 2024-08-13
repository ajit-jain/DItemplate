import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  apiKey: process.env.CUSTOMER_API_KEY,
}));
