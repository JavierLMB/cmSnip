# cmSnip

Live link - <a href="https://cmsnip.vercel.app/" target="_blank">https://cmsnip.vercel.app/</a>

## **cmSnip App**

cmSnip is a flexible content management system (CMS) designed to help teams efficiently manage code snippets and templates. Developers can build dynamic templates that non-technical users can easily populate, making it an ideal tool for collaborative content creation between technical and non-technical team members.

---

## **Overview**

<img src="/client/public/cmSnipGif.gif" alt="cmSnip Gif">

## **How to Use**

1. **Sign Up / Log In**: Register or log in to access your account and manage snippets or templates.
2. **User Roles**: Depending on your assigned role, you can:
   - **Admin**: Manage users, create and manage both snippets and templates.
   - **Editor**: Create and manage snippets and templates but without user management rights.
   - **Viewer**: View snippets and templates without any editing permissions, providing a read-only experience.
   - **Guest**: Limited access to the dashboard, allowing for basic navigation and exploration.
3. **Create a Snippet**: Click "CREATE NEW" in the Snippets section to add a new snippet with a name, state, and code content.
4. **Create a Template**: Navigate to the Templates section and click "CREATE NEW" to create a new template. Define dynamic fields to make it easy for non-technical users to fill in required information. To add a new field, insert the field name in the content within double curly brackets, like this: {{fieldname}}.
5. **Use Template**: In the Snippets section, click "USE TEMPLATE" to fill dynamic fields in an existing template.
6. **Edit & Manage**:
   - **Snippets**: Modify or delete snippets as needed.
   - **Templates**: Developers can update the structure of templates, while non-technical users can fill in the dynamic fields from the snippet section.

## **Features**

- **User Roles**: Role-based access for Admin, Editor, Viewer, and Guest.
- **Snippet Management**: Create, edit, and organize code snippets, allowing developers to store reusable pieces of code.
- **Template Creation**: Developers can build templates with customizable fields, making it easy for non-technical users to fill in content without touching code.
- **Dynamic Fields**: Set up flexible fields within templates that adapt to user needs, making the content creation process intuitive and efficient.
- **Search & Filter**: Easily search for snippets or templates by name, editor, or other metadata.
- **Pagination**: View and manage large amounts of snippets or templates through a paginated layout.
- **User Authentication**: Secure login and registration system with role-based access control.
- **Mobile-Responsive Design**: A responsive UI that works seamlessly on both desktop and mobile devices.
- **Theming**: Customize the app’s appearance with different themes to fit your personal or team preferences.

## **Technologies Used**

- **Frontend**:

  - React
  - TypeScript
  - Styled Components
  - Jotai

- **Backend**:

  - Node.js
  - Express
  - MongoDB (Mongoose)
  - JWT Tokens
  - Sendgrid

## **Environment Configuration & Running Locally**

To run the cmSnip project locally, you'll need to configure environment variables for both the client and server. Ensure that the .env files are placed in the root directories of the client and server respectively.

### **Client (.env)**

| Variable                 | Description                                |
| ------------------------ | ------------------------------------------ |
| REACT_APP_PRODUCTION_URL | Production site URL (optional during dev). |

### **Server (config.env)**

| Variable              | Description                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NODE_ENV              | Set to "development" or "production".                                                                                                                       |
| DATABASE              | MongoDB connection string. Leave `<PASSWORD>` as is in the string, as it will be replaced automatically with your `DATABASE_PASSWORD` variable in the code. |
| DATABASE_PASSWORD     | Your MongoDB password.                                                                                                                                      |
| PRODUCTION_URL        | URL of the deployed frontend app (optional during dev).                                                                                                     |
| JWT_SECRET            | Strong secret key for JWT token generation.                                                                                                                 |
| JWT_EXPIRES_IN        | JWT token expiration time (e.g., 90 days).                                                                                                                  |
| JWT_COOKIE_EXPIRES_IN | Authentication cookie expiration time (e.g., 90 days).                                                                                                      |
| SENDGRID_API_KEY      | SendGrid API key for email services.                                                                                                                        |
| SENDGRID_EMAIL_FROM   | Verified SendGrid sender email.                                                                                                                             |

### **Running Locally**

1. Clone the repository.
2. Navigate to the root directory.
3. Install dependencies: `npm install`
4. Install both frontend and backend dependencies: `npm run install:all`
5. Start the development server: `npm start`

## **Author**

- Javier C
  - GitHub: [https://github.com/JavierLMB](https://github.com/JavierLMB)

## **License**

This project is licensed under the MIT License.
See [MIT License](https://opensource.org/licenses/mit-license.php) for details.

##

<div style="text-align: center;">
Thank you for exploring cmSnip!
</div>
