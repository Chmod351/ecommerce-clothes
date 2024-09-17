# How to start?
clone this repo
`npm i`
create an .env file
and `npm run dev`
# Project Documentation

This document provides an overview of the setup and available endpoints in the project.
Environment Variables

To properly set up the runtime environment, the following environment variables need to be established:

    MONGO_DB: Connection string to the MongoDB database.
    ORIGIN: Allowed origin for CORS requests.
    PORT: Port on which the application will run.
    SECRET_KEY: Secret key used for generating Session
    ACTUAL_ENVIRONMENT: Environment in which the application is running (development, production, etc.).

These variables should be configured before starting the application,  via a .env file 

Below are the available endpoints in the API:

## Products

    GET /api/v1/products: Retrieves a list of all products.
    GET /api/v1/products/search: Searches for products by specific query.
    GET /api/v1/products/:id: Retrieves details of a specific product by its ID.
    POST /api/v1/products/create: Creates a new product. Requires admin permissions.
    PUT /api/v1/products/update/:id: Updates a specific product by its ID. Requires admin permissions.
### Product Management Documentation

This section documents the functionalities related to product management within the application, including listing all products, finding products by query, retrieving a single product by ID, creating, updating, and deleting products.
Product Model (productModel.ts)

The Product model represents a product available for purchase. It includes various attributes such as names, descriptions, images, prices, categories, seasons, stock details, and weight.
Fields

    _id: Unique identifier for the product.
    name_es and name_en: Name of the product in Spanish and English.
    description_es and description_en: Description of the product in Spanish and English.
    image_url: Array of URLs pointing to product images.
    price_es and price_en: Price of the product in euros and dollars.
    category: Category under which the product falls.
    seasson: Seasonal availability of the product.
    stock: Array of objects detailing stock levels, including color, provider, provider cost, quantity, and size.
    weight: Weight of the product.
    createdAt and updatedAt: Timestamps indicating when the product was created and last updated.

#### Product Controller (productController.ts)

The ProductController class contains methods for handling HTTP requests related to products.
Methods

    findAll(req, res, next): Retrieves a paginated list of products. Accepts a page query parameter to specify the page number. Returns a simplified version of product details excluding unnecessary information.

    findByQuery(req, res, next): Finds products matching a given query string. Accepts a query and page query parameters. Returns products whose name or description matches the query.

    findById(req, res, next): Retrieves a single product by ID. Requires an id path parameter.

    create(req, res, next): Creates a new product. Expects a request body containing product details such as descriptions, names, image URLs, prices, stock, etc.

    update(req, res, next): Updates an existing product. Expects a request body containing the product ID along with the fields to update.

    delete(req, res, next): Deletes a product by ID. Expects a request body containing the product ID.

#### Product Schema (productSchema.ts)

Defines the structure of a product document within the MongoDB collection. Includes validation rules for fields such as minimum and maximum lengths for descriptions and names, required fields, and enum values for sizes.

## Orders

    GET /api/v1/orders: Retrieves a list of all orders.
    PUT /api/v1/orders/update/:id: Updates the status of a specific order by its ID. Requires admin permissions.
    POST /api/v1/orders/create: Creates a new order.
    DELETE /api/v1/orders/delete/:id: Deletes a specific order by its ID. Requires admin permissions.
### Order Management Documentation

This section documents the functionalities related to order management, including retrieving orders, updating order statuses, creating new orders, deleting orders, and generating monthly sales reports.
Order Model (orderModel.ts)

The Order model represents an order placed by a user. It includes details such as order items, shipping address, payment method, status, total price, and user data.
Fields

    _id: Unique identifier for the order.
    orderItems: An array of objects representing the products ordered, including product ID, price, and quantity.
    shippingAddress1: Primary shipping address.
    shippingAddress2: Secondary shipping address (optional).
    paymentMethod: Method of payment used for the order.
    paymentStatus: Status of the payment (Pending, Failed, Success).
    status: Current status of the order (Pending, Processing, Shipped, Delivered, Cancelled).
    totalPrice: Total price of the order.
    userData: Object containing user information such as city, country, email, name, phone numbers, surname, and zip code.

#### Order Controller (orderController.ts)

The OrderController class contains methods for handling HTTP requests related to orders.
Methods

    findAll(req, res, next): Retrieves a paginated list of orders. Accepts a page query parameter to specify the page number.

    updateOrderStatus(req, res, next): Updates the status of an order. Requires an id path parameter and a status field in the request body.

    createOrder(req, res, next): Creates a new order. Expects an object in the request body containing orderItems, totalPrice, and other order details. Validates the total price against calculated totals from product prices and quantities.

    deleteOrder(req, res, next): Deletes an order by ID. Requires an id path parameter.

    getMonthlySalesReport(req, res, next): Generates a monthly sales report. Accepts month and year query parameters to specify the reporting period. Returns aggregated data including successful orders, total orders, total products sold, and total sales.

#### Order Schema (orderSchema.ts)

Defines the structure of an order document within the MongoDB collection. Includes indexes on paymentStatus and status fields for optimized querying.

## Users

    POST /api/v1/user/login: Authenticates a user and returns a JWT token.
    POST /api/v1/user/logout: Logs out a user.
    PUT /api/v1/user/update/:id: Updates information of a specific user by its ID.

### User Management Documentation

This section documents the functionalities related to user management within the application, focusing on operations such as finding users by ID, updating user profiles, creating new users, logging in, and logging out.
User Model (userModel.ts)

The User model represents a user account within the system. It includes essential attributes such as email, password, username, and user type.
Fields

    _id: Unique identifier for the user.
    email: Email address of the user. Must be unique and valid.
    password: Encrypted password of the user. Minimum length is 8 characters.
    type: Type of user, either 'admin' or 'customer'. Default value is 'customer'.
    username: Username chosen by the user. Must be unique and between 3 to 50 characters in length.
    createdAt and updatedAt: Timestamps indicating when the user was created and last updated.

#### User Controller (userController.ts)

The UserController class contains methods for handling HTTP requests related to users.
Methods

    findById(req, res, next): Retrieves a single user by ID. Requires an id path parameter.

    update(req, res, next): Updates an existing user's password. Requires an id path parameter and a password field in the request body. The password is hashed before being saved.

    create(req, res, next): Creates a new user. Expects a request body containing username, password, and email. Validates the presence of these fields and hashes the password before saving.

    login(req, res, next): Authenticates a user and establishes a session. Expects a request body containing email and password. Upon successful authentication, regenerates the session and stores user type information in the session object.

    logout(req, res, next): Destroys the user's session and clears the session cookie.

#### User Schema (userSchema.ts)

Defines the structure of a user document within the MongoDB collection. Includes validation rules for fields such as email format, password length, username uniqueness, and enum values for user types.

Additional Notes

    Endpoints requiring admin permissions (isUserAdmin) can only be accessed by authenticated users with admin roles.
    The search functionality (/search) allows filtering products based on provided query parameters.
    For operations that modify resources (create, update, delete), ensure you have the appropriate permissions and consider relevant security implications.

# Project Architecture Documentation

This document outlines the architecture of the project, detailing the organization of directories and files, and explaining the role of each component within the system.
Directory Structure Overview

The project is organized into several directories, each serving a specific purpose within the application:

    src/: Contains the source code of the application.
        application/: Core business logic and application setup.
        orders/, products/, users/: Modules for handling specific functionalities related to orders, products, and users respectively.
        config/: Configuration settings and utilities.
        helpers/: Helper functions and utilities used across the application.
        middlewares/: Middleware functions for request processing.
        repositories/: Interfaces and implementations for data access and storage.

## Detailed Component Breakdown
### Application Core (application/)

    orders/: Handles operations related to orders.
        orderControllers.ts: Defines controllers for handling order-related HTTP requests.
        orderModel.ts: Defines the data model for orders.
        orderRoutes.ts: Sets up routes for order-related endpoints.
        orderServices.ts: Contains business logic for processing orders.
        orderTypes.ts: Type definitions and interfaces related to orders.

    products/: Manages product-related functionalities.
        productControllers.ts: Controllers for handling product-related HTTP requests.
        productModel.ts: Data model definitions for products.
        productRoutes.ts: Routes setup for product endpoints.
        productServices.ts: Business logic for processing products.
        productTypes.ts: Type definitions and interfaces for products.

    users/: Deals with user management and authentication.
        userControllers.ts: Controllers for user-related operations.
        userModel.ts: Defines the data model for users.
        userRoutes.ts: Sets up routes for user-related endpoints.
        userServices.ts: Contains business logic for user management.
        userTypes.ts: Type definitions and interfaces related to users.

### Configuration (config/)

    dbConfig.ts: Database connection settings and configurations.
    dictionary.ts: A collection of constants or predefined values used across the application.
    envConfig.ts: Environment variable configurations and utilities.

### Helpers (helpers/)

    encription.ts: Encryption utilities, possibly for password hashing or data encryption.
    errorHandler.ts: Centralized error handling logic.
    idChecker.ts: Utility functions for checking IDs in requests.

### Middlewares (middlewares/)

    middlewares.ts: Middleware functions that can be applied to routes for request preprocessing, such as authentication checks or request validation.
