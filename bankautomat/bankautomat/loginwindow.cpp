#include "loginwindow.h"
#include "ui_loginwindow.h"
#include "bankwindow.h"

LoginWindow::LoginWindow(QWidget * parent): QMainWindow(parent), ui(new Ui::LoginWindow) {
    ui -> setupUi(this);
}

LoginWindow::~LoginWindow() {
    delete ui;
    ui = nullptr;
    delete objectUser;
    objectUser = nullptr;
}

void LoginWindow::on_btnLogin_clicked() {
    QString userId = ui->lineEditUsername->text();
    QString userPasswd = ui->lineEditPassword->text();
    QJsonObject json;
    json.insert("id", userId);
    json.insert("passwd", userPasswd);
    QJsonDocument doc (json);
    QString strJson(doc.toJson(QJsonDocument::Compact));
    qDebug() << "Sent JSON: " + strJson;
    QString db_url = "http://87.100.209.5";
    QNetworkRequest request(db_url+"/login");
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    loginManager = new QNetworkAccessManager(this);
    connect(loginManager, SIGNAL(finished(QNetworkReply*)),
            this, SLOT(loginSlot(QNetworkReply*)));
    reply = loginManager -> post(request, QJsonDocument(json).toJson());
}

void LoginWindow::loginSlot(QNetworkReply *reply) {
    QByteArray response_data = reply -> readAll();
    QJsonDocument doc = QJsonDocument::fromJson(response_data);
    QJsonObject obj = doc.object();
    QJsonValue jsonVal = obj.value(QString("token"));
    QString jwtToken = jsonVal.toString();
    qDebug() << "JWT Token: " + jwtToken;
    if (jwtToken.size() >= 6) {
        qDebug() << "Valid login!";
        BankWindow * bankWindow = new BankWindow();
        bankWindow->setJwtFromMain(jwtToken);
        bankWindow -> show();
        this -> close();
    } else {
        ui -> lineEditPassword -> setText("");
        ui -> lineEditUsername -> setText("");
        ui -> labelError -> setText("Sisäänkirjautuminen ei onnistunut.");
    }
}
