# Grail Shops


https://github.com/tobywcj/Grail-Shops/assets/71925079/241d7b07-58af-41d9-a779-eed3e1689896



## About
This is my first full-stack web application, which serves as a review website for exploring special shops from around the world and discovering the latest trendy products imported from Sneaks-API. The application features login, sign-up, Admin role, Mapbox API integration, and Create, Edit, Update, and Delete (CRUD) functionality for campgrounds, comments, and reviews. Create routes require authentication, and Edit, Update, and Delete routes require authentication and authorization. The initial foundation for this project was built during the capstone project of The Web Developer Bootcamp on Udemy.


https://github.com/tobywcj/Grail-Shops/assets/71925079/df20eacd-39af-4e10-bccf-5f8f17f8fbc9


## Product Features and Specifications
- Account creation, including an Admin role
- Users can upload data on campgrounds and edit only their own data, not others'.
- Users can leave multiple comments on each campground page.
- Each user can leave one review, rating between 1 and 5 stars, for each campground.
- Map embedded on each campground page.


## Design and Architecture
### Code Architecture
For this project, I used a Model-View-Controller (MVC) Monolithic Architecture, as it is the most straightforward architecture for gaining an introduction to full-stack web development. A Monolithic Architecture provides a good perspective on the range of architectures, especially on the lower end of the spectrum. However, it falls short in scalability and separation of front-end and back-end. The MVC Architecture also becomes inadequate as the application grows in complexity with additional services that could stand on their own. Therefore, it is best suited for simple proof-of-concept projects like this one. 

#### Model
I used a NoSQL database, MongoDB, for its flexibility compared to a SQL database and its prevalence in the industry.

#### View
For the front-end templating language, I chose Embedded JavaScript Templates (EJS) for more DRY code compared to plain HTML and for dynamic user experiences. This is a simple templating language. However, both fall short in front-end scalability, modularity, and performance compared to a framework like React. Working with simple templating languages helps to remind me of the benefits of working with a framework like React.

I used Bootstrap 5 as the CSS framework to keep the UI simple and quick to build. Since Bootstrap can affect website performance, I took full advantage of advanced Bootstrap features such as custom validation for all forms and animated form input for the login and register pages.

#### Controller
I chose Node.js as the backend programming language for its rich ecosystem and community support. For example, I leveraged PassportJs for the authentication and authorization since it's a common out-of-the-box solution. Create routes require authentication, and Update and Delete routes require authentication and authorization.

I used Express.js as the Node.js application framework since it's a lightweight framework, which is ideal for gaining an understanding of how to build the backend from scratch. 

## What I've learned
- HTML5
- CSS3
- Flexbox
- Responsive Design
- JavaScript (all 2022 modern syntax, ES6, ES2018, etc.)
- Asynchronous JavaScript - Promises, async/await, etc.
- AJAX and single page apps
- Bootstrap 4 and 5
- ReactJS
- SemanticUI
- DOM Manipulation
- Unix(Command Line) Commands
- NodeJS
- NPM
- ExpressJS
- Templating
- REST
- SQL vs. NoSQL databases
- MongoDB
- Database Associations
- Schema Design
- Mongoose
- Authentication From Scratch
- Cookies & Sessions
- Authorization
- Common Security Issues - SQL Injection, XSS, etc.
- Developer Best Practices
- Deploying Apps
- Cloud Databases
- Image Upload and Storage
- Maps and Geocoding
