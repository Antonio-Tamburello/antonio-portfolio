import 'server-only';
import { z } from 'zod';

const boolish = z
  .string()
  .optional()
  .transform((v) => (v ?? 'false').toLowerCase())
  .pipe(z.enum(['true', 'false']))
  .transform((v) => v === 'true');

const billingMode = z.enum(['payment', 'subscription']).optional().default('payment');

const schema = z
  .object({
    NEXT_PUBLIC_APP_URL: z.url(),
    PRODUCTION_URL: z.url().optional().default('https://yourdomain.com'),
    DATABASE_URL: z.string().min(1),

    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),

    GOOGLE_CLIENT_ID: z.string().optional().default(''),
    GOOGLE_CLIENT_SECRET: z.string().optional().default(''),

    ENABLE_BILLING: boolish,
    BILLING_MODE: billingMode,

    STRIPE_SECRET_KEY: z.string().optional().default(''),
    STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),

    STRIPE_PRICE_ID_SUBSCRIPTION: z.string().optional().default(''),

    STRIPE_PRICE_ID_STARTER: z.string().optional().default(''),
    STRIPE_PRICE_ID_PRO: z.string().optional().default(''),
    STRIPE_PRICE_ID_ENTERPRISE: z.string().optional().default(''),

    NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER: z.string().optional().default(''),
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO: z.string().optional().default(''),
    NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE: z.string().optional().default('')
  })
  .superRefine((v, ctx) => {
    if (!v.ENABLE_BILLING) return;

    if (!v.STRIPE_SECRET_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['STRIPE_SECRET_KEY'],
        message: 'Required when ENABLE_BILLING=true'
      });
    }
    if (!v.STRIPE_WEBHOOK_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['STRIPE_WEBHOOK_SECRET'],
        message: 'Required when ENABLE_BILLING=true'
      });
    }

    if (v.BILLING_MODE === 'subscription') {
      if (!v.STRIPE_PRICE_ID_SUBSCRIPTION) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['STRIPE_PRICE_ID_SUBSCRIPTION'],
          message: 'Required for BILLING_MODE=subscription'
        });
      }
    } else {
      const ok = v.STRIPE_PRICE_ID_STARTER && v.STRIPE_PRICE_ID_PRO && v.STRIPE_PRICE_ID_ENTERPRISE;
      if (!ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['BILLING_MODE'],
          message: 'For payment mode you must provide STRIPE_PRICE_ID_STARTER/PRO/ENTERPRISE'
        });
      }
    }
  });

const parsed = schema.parse(process.env);

export const env = {
  ...parsed,
  googleEnabled: Boolean(parsed.GOOGLE_CLIENT_ID && parsed.GOOGLE_CLIENT_SECRET)
};
