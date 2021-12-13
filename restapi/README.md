# Backend

## /login
#### body schema:
- JSON:
    ```
    {"id": "123456", "passwd": "1234"}
    ```
 - id = cardnumber to log in to
 - passwd = card PIN

### response schema:
- JSON:
    ```
    {"token":"{{jwt_token_comes_here}}"}
    ``` 
 - returns jwt token that is valid for 1 hour and should be used for authentication
## /tilit
### headers:
 - jwt-token: {{jwt_token_comes_here}}

### response schema:
- JSON:
    ```
    [
        "FI123456789",
        "FI213456789"
    ]
    ```
 - response contains a lis of accounts registered to the card used on login

## /tili
### headers:
 - jwt-token: {{jwt_token_comes_here}}
### body schema:
 - JSON:
    ```
    {"tili": "FI123456789"}
    ```
 - tili = accountnumber of the account you want more info on
### response schema:
- JSON:
    ```
    {
    "idTili": 2,
    "idOmistaja": 2,
    "Tilinumero": "FI213456789",
    "Saldo": "-100",
    "Kortin_tyyppi": "CREDIT",
    "Luottoraja": "1000",
    "idKortti": 2
    }
    ```
- idTili: int, identifier of tili,
- idOmistaja: int, identifier of omistaja,
- Tilinumero: str, account number
- Saldo: str of current balance on account, (stored in db as decimal dont know why str here shouldn't matter since math done on backend)
- Kortin_tyyppi: str, DEBIT or CREDIT to present if the account is debit or credit
- Luottoraja: str, credit limit of the account to represent how much it can have debt
- idKortti: int, identifier of the card the account is bound to

## /talletus
### headers:
 - jwt-token: {{jwt_token_comes_here}}
### body schema:
 - JSON:
    ```
    {"tili":"FI213456789", "maara": 200}
    ```
 - tili: str, account number where to deposit money
 - maara: int, number of money to deposit
### response schema:
- raw:
  ```
  success
  ```
    - this is returned on success
- raw:
  ```
  errormessage comes here
  ```
    - returns error if the transaction failed

## /nosto
### headers:
 - jwt-token: {{jwt_token_comes_here}}
### body schema:
 - JSON:
    ```
    {"tili":"FI213456789", "maara": 200}
    ```
 - tili: str, account number from where to withdraw money
 - maara: int, number of money to withdraw
### response schema:
- raw:
  ```
  success
  ```
    - this is returned on success
- raw:
  ```
  errormessage comes here
  ```
    - returns error if the transaction failed

## /tilitapahtumat
### headers:
 - jwt-token: {{jwt_token_comes_here}}
### body schema:
 - JSON:
    ```
    {"tili": "FI123456789"}
    ```
 - tili = accountnumber of the account you want more info on
### response schema:
 - JSON:
    ```
    [
    {
        "idTilitapahtumat": 12,
        "Paivays": "2021-12-12T17:29:51.000Z",
        "Tapahtuma": "Talletus",
        "Rahamaara": "100",
        "Tilitapahtuma": "200",
        "idTili": 2,
        "idKortti": 2
    },
    {
        "idTilitapahtumat": 13,
        "Paivays": "2021-12-12T17:43:32.000Z",
        "Tapahtuma": "Nosto",
        "Rahamaara": "300",
        "Tilitapahtuma": "200",
        "idTili": 2,
        "idKortti": 2
    },
    {
        "idTilitapahtumat": 14,
        "Paivays": "2021-12-12T17:43:36.000Z",
        "Tapahtuma": "Nosto",
        "Rahamaara": "100",
        "Tilitapahtuma": "200",
        "idTili": 2,
        "idKortti": 2
    }
    ]
    ```
    - idTilitapahtumat: int, id of the transaction
    - Paivays: timsetamp of the transaction
    - Tapahtuma: str, Talletus or Nosto to describe action
    - Rahamaara: str, amount of money on the account before transaction
    - Tilitapahtuma: str, amount of money withdrawn or deposited
    - idTili: int, identifier of the account in question
    - idKortti: identifier of the card used

## /register
### headers:
 - jwt-token: {{jwt_token_comes_here}}
### body schema:
- JSON:
    ```
    {"passwd": "1234", "name": "jake", "lastName": "aaa", "accountType": "CREDIT", "creditLimit": 10000}
    ```
    - passwd: str, PIN to set as passcode to new card
    - name: str, name of the account holder
    - lastName: str, lastname of the account holder
    - accountType: str, CREDIT or DEBIT to set te account to credit or debit
    - creditLimit: Optional[int], if credit sets the limit, must be provided if credit account
### response schema:
- JSON:
  ```
  {"status":"success", "cardnum":"605342", "accountnum":"FI786420416"}
  ```
  - status: str, success if succesfull
  - cardnum: str, identifier of the card created, NOTE: used for login
  - accountnum: str, identifier of the account created
## /uusitili
### headers:
 - jwt-token: {{jwt_token_comes_here}}
### body schema:
- JSON:
  ```
  {"accountType": "DEBIT"}
  ```
### response schema:
- JSON:
  ```
  {"status":"success", "accountnum":"FI434455713"}
  ```
  - status: str, success to indicate success
  - accountnum: str, identifier of the account created
