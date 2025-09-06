# 🎮 GameNest Creator Panel

![GameNest Logo](https://via.placeholder.com/800x200.png?text=GameNest+Creator+Panel)

A full-featured **Creator Dashboard** for managing courses, chapters, subchapters, lessons, and multimedia uploads. Built with **Next.js (App Router)**, **React**, **Tailwind CSS**, **Cloudinary**, and **Toastify** for smooth UI notifications.

---

## 📝 Description

This project is a **creator panel** for an e-learning platform where instructors can:

* Add and manage **courses** with metadata (title, slug, category, price, description, thumbnail).
* Add **chapters** and **subchapters** with hierarchical order.
* Add **lessons** under subchapters, including video and image uploads.
* Upload **lesson videos, images, and thumbnails** via Cloudinary.
* Delete courses, chapters, subchapters, and lessons.
* View all content in a structured dashboard.
* Students can purchase courses securely using Razorpay payment gateway.

The dashboard is responsive and adapts to **mobile and desktop views**.

---

## ⚡ Features

* **Course Management**

  * Add, update, and delete courses.
  * Upload course thumbnails.
* **Chapter & Subchapter Management**

  * Add and delete chapters.
  * Add and delete subchapters under chapters.
* **Lesson Management**

  * Add lessons with sections, code snippets, images, and videos.
  * Delete lessons easily.
* **File Upload**

  * Upload video and image files via Cloudinary.
  * Support multiple image uploads per lesson.
* **Responsive Design**

  * Automatically adapts layout for mobile and desktop screens.
* **Real-Time Notifications**

  * Toast messages for success, error, and info states.
* **Secure Access**
  * Only authenticated creators can perform actions via protected endpoints.

* **Payment Integration**

  * Students can purchase courses via Razorpay.
  * Secure and seamless checkout experience.
* **AI Integration**

  This panel leverages **OpenAI/Groq APIs** to enhance course content and interactivity:

  * **Automatic Summaries** – Generate concise summaries of lessons for quick review.
  * **Question Generation** – Create practice questions (POTD-style) from lesson content.
  * **File Upload Analysis** – Validate uploaded lesson files and provide automated feedback.
  * **Answer Checking** – Automatically check answers submitted by students.


---

## 🛠 Tech Stack

* **Frontend:** Next.js 13+, React 18+, Tailwind CSS, React Icons
* **Backend:** Node.js/Express (API endpoints, Cloudinary integration)
* **Database:** MongoDB / Mongoose (course structure and content)
* **File Uploads:** Cloudinary API for images and videos
* **State Management:** React hooks, local component state
* **Notifications:** react-toastify

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/GameNest-CreatorPanel.git
cd GameNest-CreatorPanel
```

2. **Install dependencies**

```bash
npm install
# or
yarn
```

3. **Setup environment variables**

Create a `.env.local` file:
```env
# Backend API URL
NEXT_PUBLIC_API="http://localhost:3000"

# Cloudinary configuration for file uploads
CLOUDINARY_API_KEY="<Your Cloudinary API Key>"
CLOUDINARY_API_SECRET="<Your Cloudinary API Secret>"

# Groq / OpenAI API key for AI-powered features
GROQ_API_KEY="<Your Groq/OpenAI API Key>"

# Razorpay payment integration
NEXT_PUBLIC_KEY_ID="<Your Razorpay Key ID>"
KEY_SECRET="<Your Razorpay Key Secret>"
WEBHOOK_SECRET="<Your Razorpay Webhook Secret>"

# Google OAuth (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="<Your Google Client ID>"
GOOGLE_CLIENT_SECRET="<Your Google Client Secret>"

# SMTP configuration for email notifications
SMTP_USER="<Your SMTP Email>"
SMTP_PASS="<Your SMTP Password>"
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## 🔗 Demo

Check out the Skillnest Live:  
[SkillNest](https://skillnest-delta.vercel.app)
---

## 🖥 Usage

1. **Login as Creator** – only authenticated creators can access the panel.
2. **Add New Course** – fill in course details and upload a thumbnail.
3. **Manage Chapters & Subchapters** – create a hierarchical structure for lessons.
4. **Add Lessons** – upload videos and images for each lesson, add text, subheadings, code snippets, and sections.
5. **Delete Content** – easily remove courses, chapters, subchapters, or lessons with a click.
6. **Responsive UI** – optimized for both desktop and mobile.

---

## 📁 Folder Structure (simplified)

```
/Components
 ├─ Loader
 │   ├─ loader.js
/ (root)
│
├─ /app                      # Next.js App Router main folder
│   ├─ /Creator              # Creator dashboard & panel pages
│   │   ├─ panel             # Creator panel with add/view courses
│   │   ├─ View              # View existing courses
│   │   └─ CreatorDashboard.js  # Main Creator dashboard component
│   ├─ /Components           # Reusable React components
│   │   ├─ Courses
│   │   │   └─ AllCourses
│   │   │       └─ allcourses.js
│   │   ├─ Loader
│   │   │   ├─ loader.js
│   │   │   └─ UploadLoader.js
│   │   └─ Common UI components
│   └─ /Hooks
│       └─ useCheckView.js   # Custom hook for mobile/desktop view detection
│
├─ /pages                     # Legacy pages (if any) or API routes
│   ├─ /api
│   │   ├─ Course.js          # CRUD API for courses
│   │   ├─ CreatorCourse.js   # API to fetch courses for a creator
│   │   └─ handle_uploads.js  # API for Cloudinary uploads
│
├─ /public                    # Static files (images, icons, etc.)
│
├─ /styles                    # CSS / Tailwind global styles
│
├─ package.json               # Project dependencies
├─ next.config.js             # Next.js configuration
└─ .env.local                 # Environment variables (API URLs, keys)

```
## 🎨 UI & UX

* Uses **Tailwind CSS** for modern and responsive styling.
* **React Icons** provide intuitive action buttons (like delete).
* **Loader** & **Uploader** components show progress during uploads.
* Mobile-first responsive design ensures usability across devices.

---

## ⚡ API Endpoints (used)

| Method | Endpoint                                                                   | Description                      |
| ------ | -------------------------------------------------------------------------- | -------------------------------- |
| GET    | `/api/CreatorCourse`                                                       | Fetch all courses of the creator |
| GET    | `/api/Course/:id`                                                          | Fetch single course by ID        |
| POST   | `/api/Course`                                                              | Add a new course                 |
| POST   | `/api/Course/:id/chapters`                                                 | Add a new chapter                |
| POST   | `/api/Course/:id/chapters/:chapterId/subchapters`                          | Add subchapter                   |
| POST   | `/api/Course/:id/chapters/:chapterId/subchapters/:subId/lessons`           | Add lesson                       |
| DELETE | `/api/Course/:id`                                                          | Delete course                    |
| DELETE | `/api/Course/:id/chapters/:chapterId`                                      | Delete chapter                   |
| DELETE | `/api/Course/:id/chapters/:chapterId/subchapters/:subId`                   | Delete subchapter                |
| DELETE | `/api/Course/:id/chapters/:chapterId/subchapters/:subId/lessons/:lessonId` | Delete lesson                    |
| POST   | `/api/payments/`                                                           | RazorPay Integration             |
| POST   | `/api/payments/webhooks`                                                   | RazorPay Webhooks                |
---



## 📝 License

This project is **MIT Licensed** – feel free to use, modify, and distribute.
