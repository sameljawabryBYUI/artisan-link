# ArtisanLink - Global Local Crafts Showcase

ArtisanLink is a full-stack web application that allows local artisans from any country to showcase their handmade crafts to a global audience.

## 👥 Team Members (W03 Team)

- Samar El Jawabry
- Shania Esguerra
- Martha Itohan Otasowie
- Daniel Paulino

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **Authentication:** GitHub OAuth

## 🚀 Local Development Setup

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/sameljawabryBYUI/artisan-link.git](https://github.com/sameljawabryBYUI/artisan-link.git)
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**
   Use the MongoDB and authentication settings provided by the backend. This
   buyer UI does not implement its own authentication or database setup.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 with your browser to see the result.

## Buyer Order UI Integration

The buyer pages call the application's API; they do not implement database or
authentication routes. The repository currently needs a backend providing the
following API and buyer-session behavior:

- `GET /api/products` and `GET /api/products/{productId}` returning a product
  with `id`, `title`, `description`, `price`, `imageUrl`, and `artisanName`.
- `GET /api/orders` returning the signed-in buyer's orders with `id`, `status`,
  `createdAt`, and a nested `product`.
- `POST /api/orders` accepting `{ "productId": "..." }`, deriving the buyer from
  the authenticated session, and returning `{ "id": "..." }` on success.

### Manual test

1. Start the app with its backend and buyer authentication available, then sign
   in using a buyer account.
2. Open the collection, choose a product, and continue to checkout.
3. Place the order. Confirm that you land on **My orders** and see the new
   order with its product, date, and status.
4. Open **My orders** again to verify history persists after navigation.
5. Also check the empty-history and signed-out states.

The order API and a test product must be available for the end-to-end steps.
