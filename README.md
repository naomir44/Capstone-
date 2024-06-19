# Flask React Project

This is the starter for the Flask React project.

## Getting started

1. Clone this repository (only this branch).

2. Install dependencies.

   ```bash
   pipenv install -r requirements.txt
   ```

3. Create a __.env__ file based on the example with proper settings for your
   development environment.

4. Make sure the SQLite3 database connection URL is in the __.env__ file.

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention.**

6. Get into your pipenv, migrate your database, seed your database, and run your
   Flask app:

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. The React frontend has no styling applied. Copy the __.css__ files from your
   Authenticate Me project into the corresponding locations in the
   __react-vite__ folder to give your project a unique look.

8. To run the React frontend in development, `cd` into the __react-vite__
   directory and run `npm i` to install dependencies. Next, run `npm run build`
   to create the `dist` folder. The starter has modified the `npm run build`
   command to include the `--watch` flag. This flag will rebuild the __dist__
   folder whenever you change your code, keeping the production version up to
   date.

## Deployment through Render.com

First, recall that Vite is a development dependency, so it will not be used in
production. This means that you must already have the __dist__ folder located in
the root of your __react-vite__ folder when you push to GitHub. This __dist__
folder contains your React code and all necessary dependencies minified and
bundled into a smaller footprint, ready to be served from your Python API.

Begin deployment by running `npm run build` in your __react-vite__ folder and
pushing any changes to GitHub.

Refer to your Render.com deployment articles for more detailed instructions
about getting started with [Render.com], creating a production database, and
deployment debugging tips.

From the Render [Dashboard], click on the "New +" button in the navigation bar,
and click on "Web Service" to create the application that will be deployed.

Select that you want to "Build and deploy from a Git repository" and click
"Next". On the next page, find the name of the application repo you want to
deploy and click the "Connect" button to the right of the name.

Now you need to fill out the form to configure your app. Most of the setup will
be handled by the __Dockerfile__, but you do need to fill in a few fields.

Start by giving your application a name.

Make sure the Region is set to the location closest to you, the Branch is set to
"main", and Runtime is set to "Docker". You can leave the Root Directory field
blank. (By default, Render will run commands from the root directory.)

Select "Free" as your Instance Type.

### Add environment variables

In the development environment, you have been securing your environment
variables in a __.env__ file, which has been removed from source control (i.e.,
the file is gitignored). In this step, you will need to input the keys and
values for the environment variables you need for production into the Render
GUI.

Add the following keys and values in the Render GUI form:

- SECRET_KEY (click "Generate" to generate a secure secret for production)
- FLASK_ENV production
- FLASK_APP app
- SCHEMA (your unique schema name, in snake_case)

In a new tab, navigate to your dashboard and click on your Postgres database
instance.

Add the following keys and values:

- DATABASE_URL (copy value from the **External Database URL** field)

**Note:** Add any other keys and values that may be present in your local
__.env__ file. As you work to further develop your project, you may need to add
more environment variables to your local __.env__ file. Make sure you add these
environment variables to the Render GUI as well for the next deployment.

### Deploy

Now you are finally ready to deploy! Click "Create Web Service" to deploy your
project. The deployment process will likely take about 10-15 minutes if
everything works as expected. You can monitor the logs to see your Dockerfile
commands being executed and any errors that occur.

When deployment is complete, open your deployed site and check to see that you
have successfully deployed your Flask application to Render! You can find the
URL for your site just below the name of the Web Service at the top of the page.

**Note:** By default, Render will set Auto-Deploy for your project to true. This
setting will cause Render to re-deploy your application every time you push to
main, always keeping it up to date.

[Render.com]: https://render.com/
[Dashboard]: https://dashboard.render.com/

# Expense Splitter

Expense Splitter is a web application that helps users manage shared expenses among group members. Users can create groups, add expenses, manage members, and calculate balances to see who owes whom.

## Features

### Authentication

-   **Sign Up**: Create a new account.
-   **Log In**: Access your account.
-   **Log Out**: Securely log out of your account.
-   **Demo User**: Access the application with a demo account.

### Group Management

-   **Create Group**: Create a group by entering a group name.
-   **View Groups**: View a list of groups the user is a member of.
-   **Update Group**: Update a group's details.
-   **Delete Group**: Delete a group.

### Expense Management

-   **Add Expense**: Add an expense to a group by entering details like description, amount, date, payer, and split method.
-   **View Expenses for a Group**: View all expenses for a selected group.
-   **Update Expense**: Update an existing expense.
-   **Delete Expense**: Delete an expense.

### Member Management

-   **Add Member to Group**: Add a member to a group by entering their email.
-   **View Members in Group**: View all members in a selected group.
-   **Update Member Role**: Update a member's role in the group.
-   **Remove Member from Group**: Remove a member from the group.

### Balance Calculation

-   **Calculate Balances**: Calculate and view how much each member owes or is owed.
-   **View Individual Balances**: View individual balances across all groups.

## User Stories

### Authentication

#### Sign Up

As a new user, I want to create an account so that I can start using the application.

#### Log In

As a registered user, I want to log into my account so that I can manage my groups and expenses.

### Demo User

As a demo user, I want to use a demo account so I can explore the application without registering.

#### Log Out

As a logged-in user, I want to log out of my account to ensure my data is secure.

### Group Management

#### Create Group

As a user, I want to create a group so that I can add members and manage shared expenses.

#### View Groups

As a user, I want to view my groups so that I can select a group to manage expenses.

#### Update Group

As a user, I want to update a group's details so that I can correct or change the group information.

#### Delete Group

As a user, I want to delete a group so that it no longer appears in my groups list.

### Expense Management

#### Add Expense

As a user, I want to add an expense to a group so that it can be tracked and split among members.

#### View Expenses for a Group

As a user, I want to view all expenses for a group so that I can see what has been spent.

#### Update Expense

As a user, I want to update an expense so that I can correct any mistakes.

#### Delete Expense

As a user, I want to delete an expense so that it no longer appears in the expense list.

### Member Management

#### Add Member to Group

As a user, I want to add members to my group so that we can share expenses.

#### View Members in Group

As a user, I want to view all members in a group so that I know who is part of the group.

#### Update Member Role

As a user, I want to update a member's role in the group so that I can manage permissions.

#### Remove Member from Group

As a user, I want to remove members from my group so that the group only contains relevant people.

### Balance Calculation

#### Calculate Balances

As a user, I want to see how much each member owes or is owed so that we can settle up.

#### View Individual Balances

As a user, I want to view my individual balance across all groups so that I know my total owed or owed amount.

## DB Schema

![schema](./images/capstone.png)

## API Documentation

### Authentication

#### Sign Up

-   **Endpoint**: `POST /auth/signup`
-   **Request Body**:

   {
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

-   **Response**:

  {
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com"
}

#### Log In

-   **Endpoint**: `POST /auth/login`
-   **Request Body**:

  {
  "email": "john@example.com",
  "password": "password123"
}


-   **Response**:

{
  "id": 1,
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "jwt-token"
}

### Demo User

**Demo User Credentials**:
{
  "email": "demo@aa.io",
  "password": "password"
}

#### Log Out

-   **Endpoint**: `POST /auth/logout`
-   **Response**:

 {
  "message": "Logged out successfully"
}


### Group Management

#### Create Group

-   **Endpoint**: `POST /groups`
-   **Request Body**:

{
  "name": "Group Name",
  "members": [
    {
      "user_id": 1,
      "role": "admin"
    },
    {
      "user_id": 2,
      "role": "member"
    }
  ]
}

-   **Response**:

{
  "id": 1,
  "name": "Group Name",
  "created_by": 1,
  "members": [
    {
      "id": 1,
      "user_id": 1,
      "group_id": 1,
      "role": "admin"
    },
    {
      "id": 2,
      "user_id": 2,
      "group_id": 1,
      "role": "member"
    }
  ]
}

#### View Groups

-   **Endpoint**: `GET /groups`
-   **Response**:

 [
  {
    "id": 1,
    "name": "Group Name",
    "created_by": 1
  },
  {
    "id": 2,
    "name": "Another Group Name",
    "created_by": 1
  }
]


#### Update Group

-   **Endpoint**: `PUT /groups/{group_id}`
-   **Request Body**:

  {
  "name": "New Group Name"
}

-   **Response**:

    {
  "id": 1,
  "name": "New Group Name",
  "created_by": 1
}

#### Delete Group

-   **Endpoint**: `DELETE /groups/{group_id}`
-   **Response**:

 {
  "message": "Group deleted successfully"
}


### Expense Management

#### Add Expense

-   **Endpoint**: `POST /groups/{group_id}/expenses`
-   **Request Body**:

  {
  "description": "Dinner",
  "amount": 100.00,
  "date": "2023-01-01",
  "payer_id": 1,
  "split_method": "equal"
}

-   **Response**:

   {
  "id": 1,
  "group_id": 1,
  "description": "Dinner",
  "amount": 100.00,
  "date": "2023-01-01",
  "payer_id": 1,
  "split_method": "equal"
}

#### View Expenses for a Group

-   **Endpoint**: `GET /groups/{group_id}/expenses`
-   **Response**:

  [
  {
    "id": 1,
    "group_id": 1,
    "description": "Dinner",
    "amount": 100.00,
    "date": "2023-01-01",
    "payer_id": 1,
    "split_method": "equal"
  },
  {
    "id": 2,
    "group_id": 1,
    "description": "Lunch",
    "amount": 50.00,
    "date": "2023-01-02",
    "payer_id": 1,
    "split_method": "equal"
  }
]


#### Update Expense

-   **Endpoint**: `PUT /groups/{group_id}/expenses/{expense_id}`
-   **Request Body**:

   {
  "description": "Lunch",
  "amount": 50.00,
  "date": "2023-01-01",
  "payer_id": 1,
  "split_method": "equal"
}


-   **Response**:

  {
  "id": 1,
  "group_id": 1,
  "description": "Lunch",
  "amount": 50.00,
  "date": "2023-01-01",
  "payer_id": 1,
  "split_method": "equal"
}

#### Delete Expense

-   **Endpoint**: `DELETE /groups/{group_id}/expenses/{expense_id}`
-   **Response**:

{
  "message": "Expense deleted successfully"
}

### Member Management

#### Add Member to Group

-   **Endpoint**: `POST /groups/{group_id}/members`
-   **Request Body**:

{
  "email": "member@example.com",
  "role": "member"
}

-   **Response**:

  {
  "id": 1,
  "user_id": 2,
  "group_id": 1,
  "role": "member"
}

#### View Members in Group

-   **Endpoint**: `GET /groups/{group_id}/members`
-   **Response**:

  [
  {
    "id": 1,
    "user_id": 2,
    "group_id": 1,
    "role": "member"
  },
  {
    "id": 2,
    "user_id": 3,
    "group_id": 1,
    "role": "admin"
  }
]

#### Update Member Role

-   **Endpoint**: `PUT /groups/{group_id}/members/{member_id}`
-   **Request Body**:

  {
  "role": "admin"
}

-   **Response**:

  {
  "id": 1,
  "user_id": 2,
  "group_id": 1,
  "role": "admin"
}

#### Remove Member from Group

-   **Endpoint**: `DELETE /groups/{group_id}/members/{member_id}`
-   **Response**:

{
  "message": "Member removed successfully"
}

### Balance Calculation

#### Calculate Balances

-   **Endpoint**: `GET /groups/{group_id}/balances`
-   **Response**:

 [
  {
    "user_id": 1,
    "balance": 50.00
  },
  {
    "user_id": 2,
    "balance": -50.00
  }
]


#### View Individual Balances

-   **Endpoint**: `GET /users/{user_id}/balances`
-   **Response**:

  [
  {
    "group_id": 1,
    "balance": 50.00
  },
  {
    "group_id": 2,
    "balance": -20.00
  }
]
