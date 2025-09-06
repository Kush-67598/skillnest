# 🎮 SkillNest

SkillNest is a full-featured web platform for creators and learners. Creators can post and sell courses using Razorpay, and users can view, purchase, and access course content securely. Built with Next.js (App Router), React, Tailwind CSS, Cloudinary, and Toastify.

---

## 📝 Description

SkillNest allows:

-   **Creators** to add/manage courses, chapters, subchapters, and lessons with videos, images, and rich text.
-   **Users** to browse courses, pay for paid courses, and access content.
-   Secure payments via **Razorpay**.
-   **AI-powered features** with OpenAI/Groq APIs for summaries, question generation, answer checking, and file validation.
-   All creator content is uploaded via **Cloudinary** and protected via authenticated routes.

---

## ⚡ Features

### Course Management
-   Add, update, delete courses.
-   Upload course thumbnails.

### Chapter & Subchapter Management
-   Add/delete chapters and subchapters.

### Lesson Management
-   Add lessons with sections, code, images, and videos.
-   Delete lessons easily.

### File Upload
-   Video and image uploads via **Cloudinary**.
-   Multiple images per lesson supported.

### User Functionality
-   Browse free/paid courses.
-   Pay for courses with **Razorpay**.
-   Access paid content after purchase.

### Authentication
-   Signup, login, and **OAuth 2.0 (Google)** for creators and users.
-   Protected routes for course content and creator panel.

### AI Integration
-   Generate lesson summaries.
-   Auto-generate practice questions (POTD style).
-   Check answers automatically.
-   Validate uploaded files.

### Responsive Design
-   Mobile-first design with **Tailwind CSS**.
-   Real-time notifications with **react-toastify**.

---

## 🛠 Tech Stack

-   **Frontend**: Next.js 13+, React 18+, Tailwind CSS, React Icons
-   **Backend**: Node.js/Express (API endpoints, Cloudinary, Razorpay)
-   **Database**: MongoDB / Mongoose
-   **File Uploads**: Cloudinary API
-   **Payments**: Razorpay
-   **State Management**: React hooks, local component state
-   **Notifications**: react-toastify

---

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/SkillNest.git](https://github.com/yourusername/SkillNest.git)
    cd SkillNest
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn
    ```

3.  **Setup environment variables**
    Create a `.env.local` file:
    ```
    NEXT_PUBLIC_API="http://localhost:3000"

    CLOUDINARY_API_KEY="<Your Cloudinary API Key>"
    CLOUDINARY_API_SECRET="<Your Cloudinary API Secret>"

    GROQ_API_KEY="<Your Groq/OpenAI API Key>"

    NEXT_PUBLIC_KEY_ID="<Your Razorpay Key ID>"
    KEY_SECRET="<Your Razorpay Key Secret>"
    WEBHOOK_SECRET="<Your Razorpay Webhook Secret>"

    NEXT_PUBLIC_GOOGLE_CLIENT_ID="<Your Google Client ID>"
    GOOGLE_CLIENT_SECRET="<Your Google Client Secret>"

    SMTP_USER="<Your SMTP Email>"
    SMTP_PASS="<Your SMTP Password>"
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open `http://localhost:3000` to access SkillNest.

---

## 🔗 Demo

Check out live: [SkillNest Live](https://skillnest-delta.vercel.app)

---

## 🖥 Usage

-   **Creators**: Login → Add courses → Add chapters/subchapters → Add lessons → Upload media → Publish.
-   **Users**: Browse courses → Purchase paid courses via Razorpay → Access content.
-   Protected routes ensure only authorized creators/users can perform actions.

---

## 📁 Folder Structure (simplified)
To ensure the file structure is displayed correctly on GitHub, you'll need to format it using a code block, which preserves line breaks and indentation. You can use either a single backtick for an inline code block or triple backticks for a multi-line block.

Here is the correct format for GitHub, which will render as a code block and maintain the tree-like structure:

```
/
├─ /app                      # Next.js App Router
│   ├─ /Creator              # Creator panel pages
│   │   ├─ panel
│   │   ├─ View
│   │   └─ CreatorDashboard.js
│   ├─ /Components           # Reusable React components
│   │   ├─ Courses
│   │   │   └─ AllCourses/allcourses.js
│   │   ├─ Loader
│   │   │   ├─ loader.js
│   │   │   └─ UploadLoader.js
│   │   └─ Common UI components
│   └─ /Hooks
│       └─ useCheckView.js
│
├─ /pages                     # Legacy pages / API routes
│   ├─ /api
│   │   ├─ Course.js
│   │   ├─ CreatorCourse.js
│   │   └─ handle_uploads.js
│
├─ /public                    # Static files
├─ /styles                    # Tailwind/global styles
├─ package.json
├─ next.config.js
└─ .env.local
```
---

## 🎨 UI & UX

-   Mobile-first responsive design
-   Modern styling with **Tailwind CSS**
-   Intuitive icons and buttons with **React Icons**
-   Upload progress loaders

---

## ⚡ API Endpoints

| Method | Endpoint                                                       | Description             |
|--------|----------------------------------------------------------------|-------------------------|
| `GET`  | `/api/CreatorCourse`                                           | Fetch all creator courses |
| `GET`  | `/api/Course/:id`                                              | Fetch single course by ID |
| `POST` | `/api/Course`                                                  | Add a new course        |
| `POST` | `/api/Course/:id/chapters`                                     | Add a chapter           |
| `POST` | `/api/Course/:id/chapters/:chapterId/subchapters`              | Add a subchapter        |
| `POST` | `/api/Course/:id/chapters/:chapterId/subchapters/:subId/lessons` | Add a lesson            |
| `DELETE` | `/api/Course/:id`                                            | Delete course           |
| `DELETE` | `/api/Course/:id/chapters/:chapterId`                        | Delete chapter          |
| `DELETE` | `/api/Course/:id/chapters/:chapterId/subchapters/:subId`     | Delete subchapter       |
| `DELETE` | `/api/Course/:id/chapters/:chapterId/subchapters/:subId/lessons/:lessonId` | Delete lesson   |
| `POST` | `/api/payments/`                                               | Razorpay Integration    |
| `POST` | `/api/payments/webhooks`                                       | Razorpay Webhooks       |
| `POST` | `/api/signup`                                                  | User/creator signup     |
| `POST` | `/api/login`                                                   | User/creator login      |
