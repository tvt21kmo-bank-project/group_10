#ifndef BANKWINDOW_H
#define BANKWINDOW_H

#include <QDialog>
#include <QObject>
#include <QPushButton>
#include <QtNetwork>
#include <QNetworkAccessManager>
#include <QJsonDocument>

namespace Ui {
class BankWindow;
}

class BankWindow : public QDialog
{
    Q_OBJECT

public:
    explicit BankWindow(QWidget *parent = nullptr);
    ~BankWindow();

    const QString &getJwtToken() const;
    void setJwtToken(const QString &newJwtToken);

    const QString &getJwtFromMain() const;
    void setJwtFromMain(const QString &newJwtFromMain);

private:
    Ui::BankWindow *ui;
    QNetworkAccessManager *getManager;
    QNetworkReply *reply;
    QByteArray response_data;
    QString jwtFromMain;

signals:
       void loginSignal();
private slots:
       void accountSlot (QNetworkReply *reply);
       void on_btnWith20_clicked();
       void on_btnWith40_clicked();
       void on_btnWith50_clicked();
       void on_btnWith100_clicked();
       void on_btnWithCustom_clicked();
       void on_btnSaldo_clicked();
       void getBalSlot(QNetworkReply *reply);
};

#endif // BANKWINDOW_H
