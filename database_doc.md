# Database documentation

The following is a list of the tables contained in the database, with related fields and explanations.

Note:

- PK = Primary Key
- FK = Foreign Key

### User

Contains generic information for a registered user.

| Field name | Type    | Constraints | Notes                                      |
| ---------- | ------- | ----------- | ------------------------------------------ |
| id         | INTEGER | **PK**      | Auto-increment                             |
| username   | TEXT    | NOT NULL    |                                            |
| password   | TEXT    | NOT NULL    |                                            |
| role       | TEXT    | NOT NULL    | Possible values: `shop_employee`, `client` |

### Client

Contains specific information about a registered client.

| Field name | Type    | Constraints    | Notes                                                        |
| ---------- | ------- | -------------- | ------------------------------------------------------------ |
| id         | INTEGER | **PK**         | Auto-increment                                               |
| name       | TEXT    | NOT NULL       |                                                              |
| surname    | TEXT    | NOT NULL       |                                                              |
| phone      | TEXT    | NOT NULL       |                                                              |
| address    | TEXT    | NOT NULL       |                                                              |
| mail       | TEXT    | NOT NULL       |                                                              |
| balance    | REAL    | NOT NULL       | Client's current wallet balance                              |
| ref_user   | INTEGER | *FK*, NOT NULL | References `User("id")`; refers to the client's own credentials |

### Prod_descriptor

Contains a description of a specific product. 

| Field name  | Type    | Constraints | Notes                                                        |
| ----------- | ------- | ----------- | ------------------------------------------------------------ |
| id          | INTEGER | **PK**      | Auto-increment                                               |
| name        | TEXT    | NOT NULL    |                                                              |
| description | TEXT    | NOT NULL    |                                                              |
| category    | TEXT    | NOT NULL    | Possible values:`fruits and vegetables`, `dairy product`, `food_items`, `meats_cold_cuts`, `pasta_and_rice`, `bread` |
| unit        | TEXT    | NOT NULL    | Measurement unit of the quantity. Possible values: `kg`, `lt` (kilograms and liters, respectively) |

### Product

Contains information about a specific supply of a product, including quantity (measured in the product's unit, e.g. kg) and price per unit (e.g. euro/kg).

| Field name          | Type    | Constraints    | Notes                              |
| ------------------- | ------- | -------------- | ---------------------------------- |
| ref_prod_descriptor | INTEGER | *FK*, NOT NULL | References `prod_descriptor("id")` |
| quantity            | REAL    | NOT NULL       |                                    |
| price               | REAL    | NOT NULL       |                                    |
| id                  | INTEGER | **PK**         | Auto-increment                     |

### Request

Contains global information about a client's order/request. Total price can be computed by using information in the tables `Product` and `Product_Request`.

| Field name | Type    | Constraints    | Notes                     |
| ---------- | ------- | -------------- | ------------------------- |
| id         | INTEGER | **PK**         | Auto-increment            |
| ref_client | INTEGER | *FK*, NOT NULL | References `Client("id")` |
| status     | TEXT    | NOT NULL       |                           |
| date       | TEXT    | NOT NULL       | Format must be `YYYY-MM-DD HH:MM` |

### Product_Request

Contains information about a request for a specific product within an order (e.g. in order n.3, the client requested 0.5kg of apples).

| Field name  | Type    | Constraints  | Notes                                           |
| ----------- | ------- | ------------ | ----------------------------------------------- |
| ref_request | INTEGER | **PK**, *FK* | References `Request("id")`                      |
| ref_product | INTEGER | **PK**, *FK* | References `Product("id")`                      |
| quantity    | REAL    | NOT NULL     | Quantity of the product requested by the client |

