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

## Orders

    GET /api/v1/orders: Retrieves a list of all orders.
    PUT /api/v1/orders/update/:id: Updates the status of a specific order by its ID. Requires admin permissions.
    POST /api/v1/orders/create: Creates a new order.
    DELETE /api/v1/orders/delete/:id: Deletes a specific order by its ID. Requires admin permissions.

## Users

    POST /api/v1/user/login: Authenticates a user and returns a JWT token.
    POST /api/v1/user/logout: Logs out a user.
    PUT /api/v1/user/update/:id: Updates information of a specific user by its ID.

Additional Notes

    Endpoints requiring admin permissions (isUserAdmin) can only be accessed by authenticated users with admin roles.
    The search functionality (/search) allows filtering products based on provided query parameters.
    For operations that modify resources (create, update, delete), ensure you have the appropriate permissions and consider relevant security implications.

Project Architecture Documentation

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

Detailed Component Breakdown
Application Core (application/)

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

Configuration (config/)

    dbConfig.ts: Database connection settings and configurations.
    dictionary.ts: A collection of constants or predefined values used across the application.
    envConfig.ts: Environment variable configurations and utilities.

Helpers (helpers/)

    encription.ts: Encryption utilities, possibly for password hashing or data encryption.
    errorHandler.ts: Centralized error handling logic.
    idChecker.ts: Utility functions for checking IDs in requests.

Middlewares (middlewares/)

    middlewares.ts: Middleware functions that can be applied to routes for request preprocessing, such as authentication checks or request validation.
