#include "bankwindow.h"
#include "loginwindow.h"
#include "ui_bankwindow.h"

BankWindow::BankWindow(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::BankWindow)
{
    ui->setupUi(this);
}

BankWindow::~BankWindow()
{
    delete ui;
    ui = nullptr;
}

void BankWindow::on_btnWith20_clicked() {

}
void BankWindow::on_btnWith40_clicked() {

}


void BankWindow::on_btnWith50_clicked() {

}


void BankWindow::on_btnWith100_clicked() {

}


void BankWindow::on_btnWithCustom_clicked() {

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

