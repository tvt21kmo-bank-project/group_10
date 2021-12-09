#include "user.h"

const QString &User::getUsername() const
{
    return username;
}

void User::setUsername(const QString &newUsername)
{
    username = newUsername;
}

const QString &User::getPassword() const
{
    return password;
}

void User::setPassword(const QString &newPassword)
{
    password = newPassword;
}

bool User::getHasCredit() const
{
    return hasCredit;
}

void User::setHasCredit(bool newHasCredit)
{
    hasCredit = newHasCredit;
}

float User::getDebitBal() const
{
    return debitBal;
}

void User::setDebitBal(float newDebitBal)
{
    debitBal = newDebitBal;
}

float User::getCreditBal() const
{
    return creditBal;
}

void User::setCreditBal(float newCreditBal)
{
    creditBal = newCreditBal;
}

User::User()
{

}
