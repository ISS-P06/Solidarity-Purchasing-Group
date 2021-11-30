# Solidarity-Purchasing-Group

Solidarity Purchasing Group is a project developed for Software Engineering II course at Politecnico di Torino.

## Docker documentation

### Development

```sh
docker-compose stop && docker-compose up --build -d --remove-orphans
```

or only

```sh
docker-compose up
```

the `-d` flag is for [detached mode](https://stackoverflow.com/questions/34029680/docker-detached-mode)

### Production

```sh
docker-compose -f docker-compose.prod.yml stop && docker-compose -f docker-compose.prod.yml up --build -d
```

the `-f` flag is for custom docker file path

### Deploy on Docker Hub

Be sure that the `.env` file is in `/server` directory

```sh
docker login
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml push
```

Where `tagname` is the name of the release

### Pull from Docker Hub

This repo has two images, one for the user interface and one for the server logic. Both images can be
pulled with:

```
docker pull gabelluardo/solidarity-purchasing-group:release1-client
docker pull gabelluardo/solidarity-purchasing-group:release1-server
```

When images are built, you can run them with:

```
docker run -d -p 3001:3001 --name spg06-server gabelluardo/solidarity-purchasing-group:release1-server
docker run -d -p 3000:80 --name spg06-client:server --link spg06-server gabelluardo/solidarity-purchasing-group:release1-client
```

**The app can be reached on http://localhost:3000 **

Note:

- the images `spg06-client` depends on the `spg06-server` one, so this must be run first
- in case of **name conflicts**, remove the containers with `docker rm <name>` and run again the commands above

## Frontend documentation

## React Client Application Routes

- Route `/`: site homepage.
- Route `/login`: contains a form with `username` and `password` fields with which a user can log in to the site.
- Route `/employee`: employee homepage, from which the user can access all routes reserved to employees only.
- Route `/employee/clients`: employee-side page containing a list of all registered clients.
- Route `/employee/clients/:id`: employee-side page displaying information about a specific client; `id`: client id.
- Route `/employee/orders`: employee-side page containing a list of all orders.
- Route `/employee/orders/:id`: employee-side page containing information about a specific order; `id`: order id.
- Route `/employee/products`: employee-side page containing a list of all available products.
- Route `/employee/register`: employee-side page containing a form for user registration.
- Route `/client`: client homepage, from which the user can access all routes reserved to clients only.
- Route `/client/basket`: client-side page containing information about the client's own basket.
- Route `/client/orders`: client-side page containing information about the client's own orders.
- Route `/client/orders/:id`: client-side page containing information about one of the client's orders.
- Route `/client/products`: client-side page containing a list of all available products.
- Route `/farmer`: farmer homepage.

# Database documentation

The following is a list of the tables contained in the database, with related fields and explanations.

Note:

- PK = Primary Key
- FK = Foreign Key

### User

Contains generic information for a registered user.

| Field name | Type    | Constraints          | Notes                                                |
| ---------- | ------- | -------------------- | ---------------------------------------------------- |
| id         | INTEGER | **PK**               | Auto-increment                                       |
| username   | TEXT    | NOT NULL, **UNIQUE** | Every username must be unique                        |
| password   | TEXT    | NOT NULL             |                                                      |
| role       | TEXT    | NOT NULL             | Possible values: `shop_employee`, `client`, `farmer` |
| name       | TEXT    | NOT NULL             |                                                      |
| surname    | TEXT    | NOT NULL             |                                                      |
| email      | TEXT    | NOT NULL, **UNIQUE** | Every e-mail address must be unique                  |
| phone      | TEXT    | NOT NULL             |                                                      |

### Client

Contains specific information about a registered client.

| Field name | Type    | Constraints            | Notes                                                           |
| ---------- | ------- | ---------------------- | --------------------------------------------------------------- |
| ref_user   | INTEGER | **PK**, _FK_, NOT NULL | References `User("id")`; refers to the client's own credentials |
| address    | TEXT    | NOT NULL               |                                                                 |
| balance    | REAL    | NOT NULL               | Client's current wallet balance                                 |

### Farmer

Contains specific information about a registered farmer.

| Field name | Type    | Constraints            | Notes                                                           |
| ---------- | ------- | ---------------------- | --------------------------------------------------------------- |
| ref_user   | INTEGER | **PK**, _FK_, NOT NULL | References `User("id")`; refers to the client's own credentials |
| address    | TEXT    | NOT NULL               |                                                                 |
| farm_name  | TEXT    | NOT NULL               | The name of the farmer's own farm                               |

### Prod_Descriptor

Contains a description of a specific product.

Note that products of the same type (e.g. apples) are treated as two separate products if they're sold by different farmers (e.g. farmer 1's apples are treated as an entirely different product from farmer 2's apples, and thus have two separate tuples in the `prod_descriptor` table).

| Field name  | Type    | Constraints    | Notes                                                                                                                |
| ----------- | ------- | -------------- | -------------------------------------------------------------------------------------------------------------------- |
| id          | INTEGER | **PK**         | Auto-increment                                                                                                       |
| name        | TEXT    | NOT NULL       |                                                                                                                      |
| description | TEXT    | NOT NULL       |                                                                                                                      |
| category    | TEXT    | NOT NULL       | Possible values:`fruits and vegetables`, `dairy product`, `food_items`, `meats_cold_cuts`, `pasta_and_rice`, `bread` |
| unit        | TEXT    | NOT NULL       | Measurement unit of the quantity. Possible values: `kg`, `lt` (kilograms and liters, respectively)                   |
| ref_farmer  | INTEGER | _FK_, NOT NULL | References `Farmer("ref_user")`; refers to the farmer who created the product descriptor.                            |

### Product

Contains information about a specific supply of a product.

| Field name          | Type    | Constraints    | Notes                                                                                   |
| ------------------- | ------- | -------------- | --------------------------------------------------------------------------------------- |
| ref_prod_descriptor | INTEGER | _FK_, NOT NULL | References `prod_descriptor("id")`; references the descriptor that describes the supply |
| quantity            | REAL    | NOT NULL       | Measured in the unit specified in the `prod_descriptor` table (e.g. kg)                 |
| price               | REAL    | NOT NULL       | Price per unit (e.g. euro/kg)                                                           |
| date                | TEXT    | NOT NULL       | Date and time of the moment the product was added; format must be `YYYY-MM-DD HH:MM`    |
| id                  | INTEGER | **PK**         | Auto-increment                                                                          |

### Request

Contains global information about a client's order/request. Total price can be computed by using information in the tables `Product` and `Product_Request`.

The `status` field describes the request's current status:

- `pending`: request has been made, but farmers need to confirm products first;
- `confirmed`: products have been confirmed and the order is ready to be delivered;
- `delivered`: products have successfully been delivered to the client;
- `pending_canc`: products have been confirmed, but the client's current balance is insufficient;
- `canceled` (_currently unused_): the order has been canceled due to insufficient funds or other reasons.

| Field name | Type    | Constraints    | Notes                                                                            |
| ---------- | ------- | -------------- | -------------------------------------------------------------------------------- |
| id         | INTEGER | **PK**         | Auto-increment                                                                   |
| ref_client | INTEGER | _FK_, NOT NULL | References `Client("ref_user")`; refers to the client who made the request       |
| status     | TEXT    | NOT NULL       | Possible values: `pending`, `confirmed`, `delivered`, `pending_canc`, `canceled` |
| date       | TEXT    | NOT NULL       | Format must be `YYYY-MM-DD HH:MM`                                                |

### Product_Request

Contains information about a request for a specific product within an order (e.g. in order n.3, the client requested 0.5kg of apples).

| Field name  | Type    | Constraints  | Notes                                                                                 |
| ----------- | ------- | ------------ | ------------------------------------------------------------------------------------- |
| ref_request | INTEGER | **PK**, _FK_ | References `Request("id")`; references the request in which the product was requested |
| ref_product | INTEGER | **PK**, _FK_ | References `Product("id")`; references the product requested                          |
| quantity    | REAL    | NOT NULL     | Quantity of the product requested by the client                                       |

### Basket

Contains information about a product present in a client's basket; the table functions similarly to `Product_Request`. This is used to represent the client's basket: every product in the basket is reserved, and when the client decides to finalize the order the products are removed from the basket (i.e. tuples are removed from this table) and added to the new request.

Note that adding products to a basket means modifying the value of `quantity` in the `Product` table, since the products are marked as reserved.

| Field name  | Type    | Constraints  | Notes                                                                        |
| ----------- | ------- | ------------ | ---------------------------------------------------------------------------- |
| ref_client  | INTEGER | **PK**, _FK_ | References `Client("ref_user")`; references the client who "owns" the basket |
| ref_product | INTEGER | **PK**, _FK_ | References `Product("id")`; references the product added to the basket       |
| quantity    | REAL    | NOT NULL     | Quantity of the product requested and reserved by the client                 |

## Registered users

Below is a list of all users registered in the database for testing purposes:

| Username      | Password (plain text) | Role          | Name      | Surname       | E-mail                     |
| ------------- | --------------------- | ------------- | --------- | ------------- | -------------------------- |
| pentolino     | pentolino             | Shop employee | pentolino | de' pentolini | giorgiomastrota@mail.com   |
| teiera        | teiera123             | Client        | Teiera    | McTeapot      | s287037@studenti.polito.it |
| nonnaPapera   | humperdink            | Farmer        | Elvira    | Coot          | elvira.coot43@mail.dck     |
| iosonoironman | tonystark             | Client        | Tony      | Stark         | tony.stark@starkinc.us     |
| mario         | itsamemario           | Client        | Mario     | Mario         | mariomario@mail.msh        |
