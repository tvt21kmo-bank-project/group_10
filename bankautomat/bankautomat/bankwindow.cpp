#include "bankwindow.h"
#include "loginwindow.h"
#include "ui_bankwindow.h"

BankWindow::BankWindow( QWidget *parent) :
    QDialog(parent),
    ui(new Ui::BankWindow)
{
    QString jwtString = this->getJwtFromMain();
    QByteArray jwt = this->getJwtFromMain().toLocal8Bit().toBase64();
    ui->setupUi(this);
    qDebug()<<"JWT String: " + jwtString;
    QString db_url = "http://87.100.209.5";
    QNetworkRequest request(db_url+"/tilit");
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    request.setRawHeader(QByteArray("Authorization"), jwt);
    getManager = new QNetworkAccessManager(this);
    connect(getManager, SIGNAL(finished(QNetworkReply*)),
            this, SLOT(accountSlot(QNetworkReply*)));
    reply = getManager -> get(request);
}

BankWindow::~BankWindow()
{
    delete ui;
    ui = nullptr;
}

const QString &BankWindow::getJwtFromMain() const
{
    return jwtFromMain;
}

void BankWindow::setJwtFromMain(const QString &newJwtFromMain)
{
    jwtFromMain = newJwtFromMain;
}

void BankWindow::accountSlot(QNetworkReply *reply)
{
    response_data=reply->readAll();
     qDebug()<<"DATA : "+response_data;
     QJsonDocument json_doc = QJsonDocument::fromJson(response_data);
     QJsonArray json_array = json_doc.array();
     QString account;
     foreach (const QJsonValue &value, json_array) {
        QJsonObject json_obj = value.toObject();
        account+=QString::number(json_obj["id_book"].toInt())+", "+json_obj["name"].toString()+", "+json_obj["author"].toString()+"\r";
     }
}

void BankWindow::on_btnWith20_clicked() {
    qDebug()<< "20 withdrawal";

}

void BankWindow::on_btnWith40_clicked() {
    qDebug()<< "40 withdrawal";

}


void BankWindow::on_btnWith50_clicked() {
    qDebug()<< "50 withdrawal";

}


void BankWindow::on_btnWith100_clicked() {
    qDebug()<< "100 withdrawal";

}


void BankWindow::on_btnWithCustom_clicked() {
    qDebug()<< "Custom withdrawal";

}


void BankWindow::on_btnSaldo_clicked() {

}

void BankWindow::getBalSlot(QNetworkReply *reply)
{
    response_data=reply->readAll();
    qDebug()<<"DATA : "+response_data;
    QJsonDocument json_doc = QJsonDocument::fromJson(response_data);
    QJsonArray json_array = json_doc.array();
    QString balance;
    foreach (const QJsonValue &value, json_array) {
       QJsonObject json_obj = value.toObject();
       balance+=QString::number(json_obj["balance"].toInt());
    }

    ui->labelBalance->setText(balance);

    reply->deleteLater();
    getManager->deleteLater();
}

