PawFinds - A Pet Adoption System🌟 Project OverviewPawFinds is a full-stack, responsive web application designed to streamline and modernize the pet adoption process. Our primary goal is to connect prospective pet parents with shelters and rescue organizations through an intuitive, user-friendly platform.  


By centralizing pet listings and digitizing the adoption workflow, PawFinds aims to increase the visibility of adoptable animals, reduce the time-to-adoption, and provide a transparent and engaging experience for all users.🚀 Key FeaturesPet Browsing & Search: Users can browse and filter adoptable pets by species, breed, age, and location.Detailed Pet Profiles: Comprehensive profiles including photos, descriptions, and basic medical information.Guided Adoption Workflow: Users can submit adoption requests online, simplifying the application process.Admin Panel (In Progress): A secure interface for shelter staff to manage pet listings, review requests, and update statuses.


💻 Tech StackPawFinds is built using the MERN Stack (MongoDB, Express, React, Node.js) with a clear, API-driven architecture.ComponentTechnologyDescriptionFrontend (Client)React, JavaScriptUser-facing web application with client-side routing (React Router) and state management using Hooks/Context.Backend (Server)Node.js, ExpressProvides secure RESTful APIs for authentication, pet management, and adoption requests.DatabaseMongoDB, MongooseStores core entities (Users, Pets, Adoption Requests) with schemas defined by Mongoose.


🛠️ Setup and InstallationFollow these steps to get a local copy of the project up and running.
PrerequisitesYou must have the following installed on your system:
Node.js (v18+)npm or yarnMongoDB (or access to a MongoDB Atlas cluster)
Docker and Docker Compose (Optional, for simplified setup)

1. Backend SetupClone the repository:git clone [Your Repository URL]
cd pawfinds-project/backend
Install dependencies:npm install
Configure Environment Variables:Create a file named .env in the backend/ directory and add your configuration details:PORT=5000
MONGO_URI="[Your MongoDB Connection String]"


# Add other necessary variables (e.g., for image upload service)
Run the server:npm start
The API will start running at http://localhost:5000.
2. Frontend SetupNavigate to the frontend directory:cd ../frontend
Install dependencies:npm install
Configure API URL:Update the environment configuration (e.g., .env file or package.json proxy) to point to your backend API:VITE_API_URL=http://localhost:5000/api
Run the client:npm run dev
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The application will open in your browser, typically at http://localhost:5173.🚧 Challenges FacedThe primary challenges encountered during this phase were:MERN Stack Integration: Ensuring seamless communication between the React frontend, Node.js/Express backend, and MongoDB (including correct CORS, API routing, and environment variable configuration).User Authentication: Successfully implementing the user login and registration flows for protected routes.Database Modeling: Designing flexible and scalable Mongoose schemas for users, pets, and complex adoption request relationships.
