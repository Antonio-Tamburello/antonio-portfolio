# 🚀 SaaS Forge Kit

A modern, production-ready SaaS boilerplate with authentication, billing, and deployment-ready features.

## ✨ Features

- **🏗️ Framework**: Next.js 14 with App Router
- **🗃️ Database**: PostgreSQL with Prisma ORM
- **🎨 Styling**: Tailwind CSS with shadcn/ui components
- **🔐 Authentication**: Better Auth with Email/Password + Google OAuth (optional)
- **💳 Billing**: Stripe integration with subscription & one-time payments (optional)
- **📱 UI/UX**: Responsive design with dark/light theme
- **⚡ Performance**: Optimized for production deployment
- **🛡️ Type Safety**: Full TypeScript support with Zod validation
- **📦 Package Manager**: pnpm for fast, efficient installs

## 🚀 Quick Start

```bash
# Clone and install dependencies
pnpm i

# Setup environment
cp .env.example .env

# Start database and apply migrations  
docker compose up -d
pnpm db:generate
pnpm db:migrate

# Start development server
pnpm dev
```

Open: http://localhost:3000

## 🔧 Configuration

### 🔑 Google OAuth (Optional)

If you set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, the UI will automatically show a **Continue with Google** button.

In Google Cloud Console, add these redirect URIs:
- `http://localhost:3000/api/auth/callback/google`
- `https://yourdomain.com/api/auth/callback/google` (for production)

### 💳 Stripe Billing (Optional)

By default, billing is disabled:

```env
ENABLE_BILLING=false
```

To enable billing:

1. Set `ENABLE_BILLING=true`
2. Configure Stripe variables:
   ```env
   STRIPE_SECRET_KEY=sk_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Choose billing mode:
   ```env
   BILLING_MODE=payment     # One-time payments
   BILLING_MODE=subscription # Recurring subscriptions
   ```
4. Add your Stripe Price IDs:
   ```env
   # For subscription mode
   STRIPE_PRICE_ID_SUBSCRIPTION=price_...
   
   # For payment mode
   STRIPE_PRICE_ID_STARTER=price_...
   STRIPE_PRICE_ID_PRO=price_...
   STRIPE_PRICE_ID_ENTERPRISE=price_...
   ```

Listen to webhooks locally:
```bash
pnpm stripe:listen
```

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Protected dashboard
│   │   └── pricing/        # Pricing page
│   ├── components/         # Reusable UI components
│   ├── lib/               # Utility functions and configs
│   └── server/            # Server-side utilities
├── prisma/                # Database schema and migrations
└── public/               # Static assets
```

## 🛠️ Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Prisma Studio
pnpm stripe:listen # Listen to Stripe webhooks locally
```

## 🏗️ Tech Stack Details

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Radix UI
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: Better Auth
- **Payments**: Stripe
- **Deployment**: Vercel-ready
- **Development**: Docker, pnpm

## 📝 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...

# Authentication  
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe Billing (Optional)
ENABLE_BILLING=false
BILLING_MODE=payment
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🚀 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy!

For other platforms, ensure you have Node.js 18+ and PostgreSQL.

## 💡 Key Features Explained

### Dynamic Pricing
- Prices are fetched directly from Stripe in real-time
- Supports both one-time payments and subscriptions
- Prevents duplicate subscriptions with smart UI states

### Smart Billing Logic  
- **Free Tier**: Users see all available plans
- **Paid Tier**: Users see upgrade/downgrade options (excluding current plan)
- **Real-time Updates**: Billing history with cancellation tracking

### Production Ready
- TypeScript for type safety
- Zod for runtime validation
- Error boundaries and loading states
- SEO optimized with metadata API

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Antonio Tamburello**

- 🔗 LinkedIn: [https://www.linkedin.com/in/antonio-tamburello/](https://www.linkedin.com/in/antonio-tamburello/)
- 🐙 GitHub: [https://github.com/Antonio-Tamburello](https://github.com/Antonio-Tamburello)

---

*Built with ❤️ for developers who want to ship fast* 🚀