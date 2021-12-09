#ifndef USER_H
#define USER_H
#include <QString>

class User
{
private:
    QString username;
    QString password;
    bool hasCredit;
    float debitBal;
    float creditBal;

public:
    User();
    const QString &getUsername() const;
    void setUsername(const QString &newUsername);
    const QString &getPassword() const;
    void setPassword(const QString &newPassword);
    bool getHasCredit() const;
    void setHasCredit(bool newHasCredit);
    float getDebitBal() const;
    void setDebitBal(float newDebitBal);
    float getCreditBal() const;
    void setCreditBal(float newCreditBal);
};

#endif // USER_H
