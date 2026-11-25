import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: 'buyer' | 'artisan';
  }

  interface Session {
    user: {
      id: string;
      role: 'buyer' | 'artisan';
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    userId?: string;
    role?: 'buyer' | 'artisan';
  }
}
