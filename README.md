# FlatFinder-fullstack


FlatFinder is a platform that facilitates the posting of rental apartments for prospective tenants. Users can browse available flats without creating an account and gain access to limited information about the property owners.

For more detailed inquiries, tenants can send messages to the owners, provided they have registered on the platform. Owners receive messages for each apartment they have listed.

Furthermore, the platform offers the option to appoint an administrator who can manage user and property additions.

On the homepage, visitors and users can view information of all apartments listed on the platform.

When a new user attempts to create an account, several requirements must be met:

- First and last names must contain at least two characters.
- Email addresses must be valid and undergo verification to ensure uniqueness.
- Passwords must meet a minimum length of six characters and include capital letters, special characters, and other criteria.
- Birthday dates are restricted to users aged between 18 and 67 years old. Users who do not meet this requirement receive a warning.

This is the frontend part, or the user interface.

For the backend, or that part that users cannot see, I use MongoDB as the database and Mongoose as a library for MongoDB.

In the backend, security is also very important, so I did my best to take all the measures I knew for database security.
So, I used a .env file to store security keys and sensitive information. JSON Web Token (JWT) was used for authentication and authorization. bcrypt was used to store encrypted passwords on the server.

Verification was also implemented for the registration and login forms on the server.

Lastly, I used Sendgrid Mail service that allows users to recover their passwords.

So, this is my backend project. I acknowledge that it can be improved, but this is as it stands until now.
